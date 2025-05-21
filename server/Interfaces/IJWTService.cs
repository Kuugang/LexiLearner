using System.Security.Claims;

using LexiLearner.Models;
using LexiLearner.Models.DTO;
namespace LexiLearner.Interfaces
{
    public interface IJWTService
    {
        string GenerateJWTToken(string userId, string role);
        string GenerateRefreshToken();
        Task<JWTDTO> GenerateTokens(string userId, string role);
        ClaimsPrincipal ValidateToken(string token);
        Task AddRefreshToken(RefreshToken RefreshToken);
        Task<string> RefreshAccessToken(RefreshTokensDTO RefreshTokensDTO);
        ClaimsPrincipal GetClaimsFromExpiredToken(string token);
    }
}
