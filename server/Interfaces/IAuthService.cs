using LexiLearner.Models;
using LexiLearner.Models.DTO;


namespace LexiLearner.Interfaces
{
    public interface IAuthService
    {
		Task<SuccessResponseDTO> Login(LoginRequest LoginRequest);

        Task<SuccessResponseDTO> VerifyGoogleTokenAsync(string token);
        Task<SuccessResponseDTO> VerifyFacebookTokenAsync(string token);

        Task<string> GenerateTwoFactorTokenAsync(User user);
        Task<ResponseDTO> ValidateTwoFactorTokenAsync(TwoFactorRequest request);
    }
}
