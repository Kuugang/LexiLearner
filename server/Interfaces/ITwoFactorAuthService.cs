using LexiLearner.Models;


namespace LexiLearner.Interfaces
{
    public interface ITwoFactorAuthService
    {
        Task<string> GenerateTwoFactorTokenAsync(User user);
        Task<bool> ValidateTwoFactorTokenAsync(User user, string token);
    }
}
