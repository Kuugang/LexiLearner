using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> SearchUsersByRoleAsync(string role, string searchTerm);
        Task<string> GetRole(User User);
        Task<User?> GetUserByIdAsync(string UserId);
        Task<Pupil?> GetPupilByUserId(string UserId);
        Task<Teacher?> GetTeacherByUserId(string UserId);
        Task<User?> GetUserByEmail(string Email);
        Task<User?> GetUserByUsername(string Username);

        Task<SuccessResponseDTO> Register(RegisterRequest RegisterRequest);

        Task<ResponseDTO> GetUserProfile(ClaimsPrincipal User);
        Task<ResponseDTO> GetPublicProfile(string Username);

        Task<User?> GetUserFromToken(ClaimsPrincipal Token);

        Task<ResponseDTO> UpdateProfile(UpdateProfileDTO UpdateProfileDTO, ClaimsPrincipal User);
        Task<ResponseDTO> DeleteAccount(ClaimsPrincipal User);
        Task<LoginStreak?> GetLoginStreak(ClaimsPrincipal User);
        Task<LoginStreak> RecordLoginAsync(String UserId);
        Task<Pupil?> GetPupilByPupilId(Guid PupilId);
        Task<SessionDTO> CreateSession(ClaimsPrincipal user);
        Task<SessionDTO> EndSession(Guid sessionId, ClaimsPrincipal user);
        Task<Session?> GetSessionById(Guid sessionId, ClaimsPrincipal user);
        Task<List<Session>> GetSessionsByUserId(string userId);
        Task<List<PupilLeaderboard>> GetPupilLeaderboard(ClaimsPrincipal user);
        Task<List<PupilLeaderboard>> GetPupilLeaderboardByPupilId(Guid pupilId);
        Task<List<PupilLeaderboard>> GetGlobal10Leaderboard();
        Task<PupilLeaderboard> CreatePupilLeaderboardEntry(PupilLeaderboardDTO.Create request);
    }
}
