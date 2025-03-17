using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

using LexiLearn.Models;
using LexiLearn.Data;
using LexiLearn.Interfaces;
using LexiLearn.Exceptions;

namespace LexiLearn.Repository
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
			return await _context.Users
				.FirstOrDefaultAsync(user => user.Id == userId);
		}
		public async Task<User?> GetUserByEmail(string email)
		{
			return await _context.Users
				.FirstOrDefaultAsync(user => user.Email == email);
		}

		public async Task<User> Create(User user, string password, string role){
			var result = await _userManager.CreateAsync(user, password);

            if(role != null){

                await _userManager.AddToRoleAsync(user, role);

                switch(role){
                    case "Pupil":
			    		Pupil pupil = new Pupil
			    		{
			    			UserId = user.Id,
			    			User = user,
			    		};
			    		await _context.Pupil.AddAsync(pupil);
			    		break;
                    case "Teacher":
                        Teacher teacher = new Teacher{
			    			UserId = user.Id,
			    			User = user,
                        };
			    		await _context.Teacher.AddAsync(teacher);
			    		break;
                }
            }

            // if (!result.Succeeded)
            // {
            //     var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            //     throw new ApplicationExceptionBase(
            //         $"{errors}",
            //         "User registration failed.",
            //         StatusCodes.Status409Conflict
            //     );
            // }

			await _context.SaveChangesAsync();
			return user;
		}

        public async Task<Pupil?> GetPupilByUserId(string UserId){
			return await _context.Pupil
				.FirstOrDefaultAsync(pupil => pupil.User.Id == UserId);
        }

        public async Task<Teacher?> GetTeacherByUserId(string UserId){
			return await _context.Teacher
				.FirstOrDefaultAsync(teacher => teacher.User.Id == UserId);
        }

        public async Task Update<T>(T entity) where T : class
        {
            _context.Set<T>().Update(entity); // Tells EF Core to track changes
            await _context.SaveChangesAsync(); // Saves changes to the database
        }
    }
}
