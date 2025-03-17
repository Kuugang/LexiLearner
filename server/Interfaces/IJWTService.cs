using System.Security.Claims;

namespace LexiLearn.Interfaces
{
    public interface IJWTService
    {
        string GenerateJWTToken(string userId, string username);
        ClaimsPrincipal ValidateToken(string token);
    }
}
