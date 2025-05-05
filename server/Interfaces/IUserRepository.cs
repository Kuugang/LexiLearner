using LexiLearner.Models;
namespace LexiLearner.Interfaces{
	public interface IUserRepository
	{
		Task<User?> GetUserByIdAsync(string userId);
		Task<User?> GetUserByEmail(string email);
		Task<User?> GetUserByUsername(string username);
		Task<User> Create(User user, string password);
		Task CreateProfile (User user, string role);
		Task<User> DeleteAccount(User user); 

        Task<Pupil?> GetPupilByUserId(string UserId);
        Task<Teacher?> GetTeacherByUserId(string UserId);

        Task Update<T>(T entity) where T : class;
        Task<LoginStreak?> GetLoginStreak(string userId);
        Task<LoginStreak> CreateLoginStreak(LoginStreak streak);
	}
}
