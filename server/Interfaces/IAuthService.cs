using LexiLearner.Models;
using LexiLearner.Models.DTO;


namespace LexiLearner.Interfaces
{
    public interface IAuthService
    {
        Task<SuccessResponseDTO> Login(LoginRequest LoginRequest);
        Task<SuccessResponseDTO> Register(RegisterRequest RegisterRequest);

        Task<ResponseDTO> VerifyGoogleTokenAsync(string token);
        Task<ResponseDTO> VerifyFacebookTokenAsync(string token);

        Task<string> GenerateTwoFactorTokenAsync(User user);
        Task<ResponseDTO> ValidateTwoFactorTokenAsync(TwoFactorRequest request);
    }
}
