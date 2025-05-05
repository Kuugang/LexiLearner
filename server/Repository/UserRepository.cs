using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

using LexiLearner.Models;
using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Exceptions;

namespace LexiLearner.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;

        public UserRepository(DataContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _userManager.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        }
        public async Task<User?> GetUserByEmail(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task<User> Create(User user, string password)
        {
            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ApplicationExceptionBase(
                    $"{errors}",
                    "User registration failed."
                );
            }

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> DeleteAccount(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task CreateProfile(User user, string role)
        {
            //TODO: FIX
            user = await _userManager.FindByIdAsync(user.Id);
            //user = JsonSerializer.Deserialize<User>(JsonSerializer.Serialize(user));
            await _userManager.AddToRoleAsync(user, role);

            switch (role)
            {
                case "Pupil":
                    Pupil pupil = new Pupil
                    {
                        // UserId = trackedUser.Id,
                        // User = trackedUser, //

                        UserId = user.Id,
                        User = user, //
                    };
                    await _context.Pupil.AddAsync(pupil);
                    break;
                case "Teacher":
                    Teacher teacher = new Teacher
                    {
                        // UserId = trackedUser.Id,
                        // User = trackedUser, //

                        UserId = user.Id,
                        User = user, //
                    };
                    await _context.Teacher.AddAsync(teacher);
                    break;
            }

            await _context.SaveChangesAsync();
            _context.Entry(user).State = EntityState.Detached;
        }

        public async Task<Pupil?> GetPupilByUserId(string UserId)
        {
            return await _context.Pupil
                .AsNoTracking()
                .FirstOrDefaultAsync(pupil => pupil.User.Id == UserId);
        }

        public async Task<Teacher?> GetTeacherByUserId(string UserId)
        {
            return await _context.Teacher
                .AsNoTracking()
                .FirstOrDefaultAsync(teacher => teacher.User.Id == UserId);
        }

        public async Task Update<T>(T entity) where T : class
        {
            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();
        }

    public async Task<LoginStreak?> GetLoginStreak(string userId)
    {
      return await _context.LoginStreak.AsNoTracking().FirstOrDefaultAsync(l => l.UserId == userId);
    }


    public async Task<LoginStreak> CreateLoginStreak(LoginStreak streak)
    {
      await _context.LoginStreak.AddAsync(streak);
      await _context.SaveChangesAsync();
      
      return streak;
    }
  }
}
