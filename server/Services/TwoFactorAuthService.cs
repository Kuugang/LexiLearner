using System;
using System.Threading.Tasks;
using LexiLearn.Interfaces;
using Microsoft.AspNetCore.Identity;


using LexiLearn.Models;

namespace LexiLearn.Services
{
    public class TwoFactorAuthService : ITwoFactorAuthService
    {
        private readonly UserManager<User> _userManager;

        public TwoFactorAuthService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> GenerateTwoFactorTokenAsync(User user)
        {
            return await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
        }

        public async Task<bool> ValidateTwoFactorTokenAsync(User user, string token)
        {
            return await _userManager.VerifyTwoFactorTokenAsync(user, "Email", token);
        }
    }
}

