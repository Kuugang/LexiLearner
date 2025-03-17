using LexiLearn.Models;
namespace LexiLearn.Interfaces{
	public interface IUserRepository
	{
		Task<User?> GetUserByIdAsync(string userId);
		Task<User?> GetUserByEmail(string email);
		Task<User> Create(User user, string password, string Role);

        Task<Pupil?> GetPupilByUserId(string UserId);
        Task<Teacher?> GetTeacherByUserId(string UserId);

        Task Update<T>(T entity) where T : class;
	}
}
