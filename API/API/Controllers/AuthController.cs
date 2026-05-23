using Dms.Application.DTOs;
using Dms.Application.Interfaces;
using Dms.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IGoogleAuthService _googleAuthService;
        private readonly IRecaptchaService _recaptchaService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            ITokenService tokenService,
            IGoogleAuthService googleAuthService,
            IRecaptchaService recaptchaService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _googleAuthService = googleAuthService;
            _recaptchaService = recaptchaService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrEmpty(request.RecaptchaToken))
            {
                return BadRequest("Recaptcha token is required.");
            }

            var isRecaptchaValid = await _recaptchaService.VerifyTokenAsync(request.RecaptchaToken);
            if (!isRecaptchaValid)
            {
                return BadRequest("Invalid Recaptcha.");
            }

            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return Unauthorized("Invalid username or password.");
            }

            var authResponse = await _tokenService.CreateAuthResponse(user);
            return Ok(authResponse);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDto request)
        {
            var googleUser = await _googleAuthService.VerifyGoogleTokenAsync(request.IdToken);
            if (googleUser == null)
            {
                return Unauthorized("Invalid Google Token.");
            }

            var user = await _userManager.FindByEmailAsync(googleUser.Email);
            if (user == null)
            {
                // Create user if not exists
                user = new ApplicationUser
                {
                    UserName = googleUser.Email, // or some generated username
                    Email = googleUser.Email,
                    FullName = googleUser.Name,
                    EmailConfirmed = true // Since they authenticated with Google
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    return BadRequest("Failed to create user.");
                }

                // Default role could be added here if needed
                // await _userManager.AddToRoleAsync(user, "User");
            }

            var authResponse = await _tokenService.CreateAuthResponse(user);
            return Ok(authResponse);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            try
            {
                var response = await _tokenService.RefreshAsync(request.AccessToken, request.RefreshToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
