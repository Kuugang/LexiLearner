using LexiLearn.Models;
using LexiLearn.Models.DTO;


namespace LexiLearn.Interfaces
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
