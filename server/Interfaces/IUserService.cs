using System.Security.Claims;

using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
    public interface IUserService
    {
        Task<string> GetRole(User user);
        Task<User?> GetUserByIdAsync(string userId);
        Task<Pupil?> GetPupilByUserId(string userId);
        Task<Teacher?> GetTeacherByUserId(string userId);
        Task<User?> GetUserByEmail(string email);
        Task<User?> GetUserByUsername(string username);

        Task<SuccessResponseDTO> Register(RegisterRequest RegisterRequest);

        Task<ResponseDTO> GetUserProfile(ClaimsPrincipal user);
        Task<ResponseDTO> GetPublicProfile(string Username);

        Task<User?> GetUserFromToken(ClaimsPrincipal token);

        Task<ResponseDTO> UpdateProfile(UpdateProfileDTO UpdateProfileDTO, ClaimsPrincipal User);
        Task<ResponseDTO> DeleteAccount(ClaimsPrincipal user);
        Task<LoginStreak?> GetLoginStreak(ClaimsPrincipal user);
        Task<LoginStreak> RecordLoginAsync(string userId);
        Task<Pupil?> GetPupilByPupilId(Guid pupilId);
    }
}
