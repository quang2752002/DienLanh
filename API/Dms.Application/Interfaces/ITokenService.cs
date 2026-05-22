using Dms.Application.DTOs;
using Dms.Domain.Entities;

namespace Dms.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(ApplicationUser user, IList<string> roles);
        string GenerateRefreshToken();
        Task<AuthResponseDto> CreateAuthResponse(ApplicationUser user);
        Task<AuthResponseDto> RefreshAsync(string accessToken, string refreshToken);
        Task RevokeAsync(string userId);
    }
}
