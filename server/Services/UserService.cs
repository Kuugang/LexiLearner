using Microsoft.AspNetCore.Identity;
using System.Security.Claims;


using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Interfaces;
using LexiLearner.Middlewares;
using LexiLearner.Exceptions;
using LexiLearner.Repository;


namespace LexiLearner.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly CachedUserRepository _cachedUserRepository;
        private readonly ITwoFactorAuthService _twoFactorAuthService;
        private readonly IJWTService _jwtService;

        // Constructor injection to get the DbContext
        
        public UserService(UserManager<User> userManager, CachedUserRepository cachedUserRepository, ITwoFactorAuthService twoFactorAuthService, IJWTService jwtService)
        {
            _userManager = userManager;
            _cachedUserRepository = cachedUserRepository;
            _twoFactorAuthService = twoFactorAuthService;
            _jwtService = jwtService;
        }

        public async Task<string> GetRole(User user)
        {
            string role = (await _userManager.GetRolesAsync(user))[0];
            return role;
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _cachedUserRepository.GetUserByIdAsync(userId);
        }
        public async Task<User?> GetUserByEmail(string email)
        {
            return await _cachedUserRepository.GetUserByEmail(email);
        }
        public async Task<SuccessResponseDTO> Register(RegisterRequest RegisterRequest)
        {
            var userByEmail = await GetUserByEmail(RegisterRequest.Email);

            if (userByEmail != null)
            {
                throw new ApplicationExceptionBase(
                    $"User with email {RegisterRequest.Email} already exists.",
                    "User registration failed.",
                    StatusCodes.Status409Conflict
                );
            }

            var user = new User
            {
                Email = RegisterRequest.Email,
                UserName = RegisterRequest.Email,
                FirstName = RegisterRequest.FirstName,
                LastName = RegisterRequest.LastName,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            await _cachedUserRepository.Create(user, RegisterRequest.Password, RegisterRequest.Role);

            var token = _jwtService.GenerateJWTToken(user.Id, user.UserName!);

            return new SuccessResponseDTO
            {
                Message = "User created successfully",
                Data = new JWTDTO
                {
                    Token = token
                }
            };
        }


            // var emailService = new EmailService();
            // // await emailService.SendEmailAsync("angelsheinen.cambarijan@cit.edu", "Lexi Learn", "Bang");
            // // await emailService.SendEmailAsync("charlene.repuesto@cit.edu", "Lexi Learn", "Bang");
            // // await emailService.SendEmailAsync("deo.talip@cit.edu", "Lexi Learn", "Bang");
            // await emailService.SendEmailAsync("jake.bajo@cit.edu", "Lexi Learn", "Bang");
            //
            // // await emailService.SendEmailAsync("jakebajo11@gmail.com", "Lexi Learn", "Bang");

        public async Task<SuccessResponseDTO> GetUserProfile(ClaimsPrincipal token){
            User? user = await GetUserFromToken(token);
            string role = await GetRole(user);

            var response = new SuccessResponseDTO
            {
                Message = "User profile fetched successfully",
                Data = null
            };

            if (role == "Pupil")
            {
                Pupil? pupil = await _cachedUserRepository.GetPupilByUserId(user.Id);
                response.Data = new PupilProfileDTO(user, pupil);
            }
            else if (role == "Teacher")
            {
                Teacher? teacher = await _cachedUserRepository.GetTeacherByUserId(user.Id);
                response.Data = new TeacherProfileDTO(user, teacher);
            }

            return response;
        }

        public async Task<User?> GetUserFromToken(ClaimsPrincipal principal)
        {
            if (principal == null) return null;
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return null;

            var userId = userIdClaim.Value;
            return await GetUserByIdAsync(userId);
        }

        
        public async Task<SuccessResponseDTO> UpdateProfile(UpdateProfileDTO UpdateProfileDTO, ClaimsPrincipal User){

            User? user = await GetUserFromToken(User);

            if (!string.IsNullOrEmpty(UpdateProfileDTO.Email))
                user.Email = UpdateProfileDTO.Email;

            if (!string.IsNullOrEmpty(UpdateProfileDTO.FirstName))
                user.FirstName = UpdateProfileDTO.FirstName;

            if (!string.IsNullOrEmpty(UpdateProfileDTO.LastName))
                user.LastName = UpdateProfileDTO.LastName;

            await _cachedUserRepository.Update(user);

            var response = new SuccessResponseDTO
            {
                Message = "Profile Updated",
                Data = null
            };

            if (UpdateProfileDTO.Role == "Pupil")
            {
                Pupil? pupil = await _cachedUserRepository.GetPupilByUserId(user.Id);

                if (UpdateProfileDTO.Age != null)
                    pupil.Age = UpdateProfileDTO.Age;

                if (UpdateProfileDTO.GradeLevel != null)
                    pupil.GradeLevel = UpdateProfileDTO.GradeLevel;

                await _cachedUserRepository.Update(pupil);
                response.Data = pupil;
            }
            else if (UpdateProfileDTO.Role == "Teacher")
            {
                Teacher? teacher = await _cachedUserRepository.GetTeacherByUserId(user.Id);

                await _cachedUserRepository.Update(teacher);
                response.Data = teacher;
            }

            return response;
        }
    }
}
