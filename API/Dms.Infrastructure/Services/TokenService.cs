using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Dms.Application.DTOs;
using Dms.Application.Interfaces;
using Dms.Domain.Entities;
using Dms.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Dms.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TokenService(IConfiguration configuration, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _configuration = configuration;
            _context = context;
            _userManager = userManager;
        }

        public string GenerateAccessToken(ApplicationUser user, IList<string> roles)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"]!;
            var issuer    = jwtSettings["Issuer"]!;
            var audience  = jwtSettings["Audience"]!;
            var expiryMin = int.Parse(jwtSettings["AccessTokenExpiryMinutes"]!);

            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
                new Claim("username", user.UserName ?? string.Empty),
                new Claim("fullName", user.FullName),
            };

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var token = new JwtSecurityToken(
                issuer:             issuer,
                audience:           audience,
                claims:             claims,
                expires:            DateTime.UtcNow.AddMinutes(expiryMin),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        public async Task<AuthResponseDto> CreateAuthResponse(ApplicationUser user)
        {
            var roles       = await _userManager.GetRolesAsync(user);
            var accessToken = GenerateAccessToken(user, roles);
            var refreshTokenStr = GenerateRefreshToken();

            // Thu hồi tất cả refresh token cũ còn active
            var oldTokens = await _context.RefreshTokens
                .Where(r => r.UserId == user.Id && r.Revoked == null)
                .ToListAsync();
            oldTokens.ForEach(t => t.Revoked = DateTime.UtcNow);

            var expiryDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpiryDays"]!);

            // Lưu refresh token mới vào DB
            var refreshToken = new RefreshToken
            {
                Token   = refreshTokenStr,
                UserId  = user.Id,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(expiryDays),
            };
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            var expiryMin = int.Parse(_configuration["JwtSettings:AccessTokenExpiryMinutes"]!);

            return new AuthResponseDto
            {
                AccessToken       = accessToken,
                RefreshToken      = refreshTokenStr,
                AccessTokenExpiry = DateTime.UtcNow.AddMinutes(expiryMin),
                UserId            = user.Id,
                Username          = user.UserName ?? string.Empty,
                FullName          = user.FullName,
                Role              = roles.FirstOrDefault() ?? "User",
            };
        }

        public async Task<AuthResponseDto> RefreshAsync(string accessToken, string refreshToken)
        {
            // Lấy principal từ access token hết hạn (không kiểm tra expiry)
            var principal = GetPrincipalFromExpiredToken(accessToken);
            var userId    = principal?.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? principal?.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                throw new UnauthorizedAccessException("Access token không hợp lệ.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new UnauthorizedAccessException("Người dùng không tồn tại.");

            // Kiểm tra refresh token trong DB
            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == refreshToken && r.UserId == userId);

            if (storedToken == null || !storedToken.IsActive)
                throw new UnauthorizedAccessException("Refresh token không hợp lệ hoặc đã hết hạn.");

            // Thu hồi refresh token cũ
            storedToken.Revoked = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await CreateAuthResponse(user);
        }

        public async Task RevokeAsync(string userId)
        {
            var tokens = await _context.RefreshTokens
                .Where(r => r.UserId == userId && r.Revoked == null)
                .ToListAsync();
            tokens.ForEach(t => t.Revoked = DateTime.UtcNow);
            await _context.SaveChangesAsync();
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey   = jwtSettings["SecretKey"]!;

            var tokenValidationParams = new TokenValidationParameters
            {
                ValidateAudience         = false,
                ValidateIssuer           = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateLifetime         = false, // Bỏ qua expiry khi refresh
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal    = tokenHandler.ValidateToken(token, tokenValidationParams, out var securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Token không hợp lệ.");

            return principal;
        }
    }
}
