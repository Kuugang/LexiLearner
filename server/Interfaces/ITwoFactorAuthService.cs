using LexiLearn.Models;


namespace LexiLearn.Interfaces
{
    public interface ITwoFactorAuthService
    {
        Task<string> GenerateTwoFactorTokenAsync(User user);
        Task<bool> ValidateTwoFactorTokenAsync(User user, string token);
    }
}
