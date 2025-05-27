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

        public async Task<User?> GetUserByIdAsync(string UserId)
        {
            return await _userManager.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == UserId);
        }
        public async Task<User?> GetUserByIdTrackedAsync(string UserId)
        {
            return await _userManager.Users.FirstOrDefaultAsync(u => u.Id == UserId);
        }
        public async Task<User?> GetUserByEmail(string Email)
        {
            return await _userManager.FindByEmailAsync(Email);
        }

        public async Task<User?> GetUserByUsername(string Username)
        {
            return await _userManager.FindByNameAsync(Username);
        }

        public async Task<User> Create(User User, string Password)
        {
            var result = await _userManager.CreateAsync(User, Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ApplicationExceptionBase(
                    $"{errors}",
                    "User registration failed."
                );
            }

            await _context.SaveChangesAsync();
            return User;
        }

        public async Task<User> DeleteAccount(User User)
        {
            _context.Users.Remove(User);
            await _context.SaveChangesAsync();
            return User;
        }

        public async Task CreateProfile(User User, string Role)
        {
            //TODO: FIX
            User = await _userManager.FindByIdAsync(User.Id);
            //user = JsonSerializer.Deserialize<User>(JsonSerializer.Serialize(user));
            await _userManager.AddToRoleAsync(User, Role);

            switch (Role)
            {
                case "Pupil":
                    Pupil pupil = new Pupil
                    {
                        // UserId = trackedUser.Id,
                        // User = trackedUser, //

                        UserId = User.Id,
                        User = User, //
                    };
                    await _context.Pupil.AddAsync(pupil);
                    break;
                case "Teacher":
                    Teacher teacher = new Teacher
                    {
                        // UserId = trackedUser.Id,
                        // User = trackedUser, //

                        UserId = User.Id,
                        User = User, //
                    };
                    await _context.Teacher.AddAsync(teacher);
                    break;
            }

            await _context.SaveChangesAsync();
            _context.Entry(User).State = EntityState.Detached;
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

        public async Task<Pupil?> GetPupilByPupilId(Guid PupilId)
        {
            return await _context.Pupil.FirstOrDefaultAsync(p => p.Id == PupilId);
        }

        public async Task<Session> CreateSession(Session Session)
        {
            _context.Attach(Session.User);
            await _context.Session.AddAsync(Session);
            await _context.SaveChangesAsync();
            return Session;
        }

        public async Task<Session?> GetSessionById(Guid SessionId)
        {
            return await _context.Session
                .AsNoTracking()
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == SessionId);
        }

        public async Task<List<Session>> GetSessionsByUserId(string UserId)
        {
            return await _context.Session
                .AsNoTracking()
                .Include(s => s.User)
                .Where(s => s.UserId == UserId)
                .ToListAsync();
        }
    }
}
