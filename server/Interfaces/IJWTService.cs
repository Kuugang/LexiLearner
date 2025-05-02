using System.Security.Claims;

namespace LexiLearner.Interfaces
{
    public interface IJWTService
    {
        string GenerateJWTToken(string userId, string username, string role);
        ClaimsPrincipal ValidateToken(string token);
    }
}
