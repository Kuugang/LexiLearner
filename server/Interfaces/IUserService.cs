using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> SearchUsersByRoleAsync(string Role, string SearchTerm);
        Task<string> GetRole(User User);
        Task<User?> GetUserByIdAsync(string UserId);
        Task<Pupil?> GetPupilByUserId(string UserId);
        Task<Teacher?> GetTeacherByUserId(string UserId);
        Task<User?> GetUserByEmail(string Email);
        Task<User?> GetUserByUsername(string Username);

        Task<ResponseDTO> GetUserProfile(ClaimsPrincipal User);
        Task<ResponseDTO> GetPublicProfile(string Username);

        Task<User?> GetUserFromToken(ClaimsPrincipal Token);
        Task<User?> GetUserFromTokenTracked(ClaimsPrincipal Token);

        Task<ResponseDTO> UpdateProfile(UpdateProfileDTO UpdateProfileDTO, ClaimsPrincipal User);
        Task<ResponseDTO> DeleteAccount(ClaimsPrincipal User);
        
        Task<Pupil?> GetPupilByPupilId(Guid PupilId);
        Task<SessionDTO> CreateSession(ClaimsPrincipal User);
        Task<SessionDTO> EndSession(Guid SessionId, ClaimsPrincipal User);
        Task<Session?> GetSessionById(Guid SessionId, ClaimsPrincipal User);
        Task<List<Session>> GetSessionsByUserId(string UserId);
    }
}
