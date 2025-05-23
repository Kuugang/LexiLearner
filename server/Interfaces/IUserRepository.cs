using LexiLearner.Models;
namespace LexiLearner.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(string userId);
        Task<User?> GetUserByEmail(string email);
        Task<User?> GetUserByUsername(string username);
        Task<User> Create(User user, string password);
        Task CreateProfile(User user, string role);
        Task<User> DeleteAccount(User user);

        Task<Pupil?> GetPupilByUserId(string UserId);
        Task<Teacher?> GetTeacherByUserId(string UserId);

        Task Update<T>(T entity) where T : class;
        Task<LoginStreak?> GetLoginStreak(Guid pupilId);
        Task<LoginStreak> CreateLoginStreak(LoginStreak streak);
        Task<Pupil?> GetPupilByPupilId(Guid pupilId);
        Task<Session> CreateSession(Session session);
        Task<Session?> GetSessionById(Guid sessionId);
        Task<List<Session>> GetSessionsByUserId(string userId);
        Task<List<PupilLeaderboard>> GetPupilLeaderboardByPupilId(Guid pupilId);
        Task<List<PupilLeaderboard>> GetGlobal10Leaderboard();
        Task<PupilLeaderboard> CreatePupilLeaderboardEntry(PupilLeaderboard pupilLeaderboard);
	}
}
