using LexiLearner.Models;
namespace LexiLearner.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(string UserId);
        Task<User?> GetUserByIdTrackedAsync(string UserId);
        Task<User?> GetUserByEmail(string Email);
        Task<User?> GetUserByUsername(string Username);
        Task<User> Create(User User, string Password);
        Task CreateProfile(User User, string Role);
        Task Update<T>(T entity) where T : class;
        Task<User> DeleteAccount(User User);
        Task<Pupil?> GetPupilByUserId(string UserId);
        Task<Teacher?> GetTeacherByUserId(string UserId);
        Task<Pupil?> GetPupilByPupilId(Guid PupilId);
        Task<Session> CreateSession(Session Session);
        Task<Session?> GetSessionById(Guid SessionId);
        Task<List<Session>> GetSessionsByUserId(string UserId);  
	}
}
