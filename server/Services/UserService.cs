using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Text.Json;


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

        public UserService(UserManager<User> userManager, CachedUserRepository cachedUserRepository, ITwoFactorAuthService twoFactorAuthService, IJWTService jwtService)
        {
            _userManager = userManager;
            _cachedUserRepository = cachedUserRepository;
            _twoFactorAuthService = twoFactorAuthService;
            _jwtService = jwtService;

        }

        public async Task<string> GetRole(User user)
        {
            // string role = (await _userManager.GetRolesAsync(user))[0];
            // return role;
            
            var roles = await _userManager.GetRolesAsync(user);
            return roles.FirstOrDefault();
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _cachedUserRepository.GetUserByIdAsync(userId);
        }
        public async Task<User?> GetUserByEmail(string email)
        {
            return await _cachedUserRepository.GetUserByEmail(email);
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            return await _cachedUserRepository.GetUserByUsername(username);
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
                UserName = RegisterRequest.UserName,
                FirstName = RegisterRequest.FirstName,
                LastName = RegisterRequest.LastName,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            user = await _cachedUserRepository.Create(user, RegisterRequest.Password);
            await _cachedUserRepository.CreateProfile(user, RegisterRequest.Role);

            var token = _jwtService.GenerateJWTToken(user.Id, user.UserName!);

            return new SuccessResponseDTO("User created successfully", new JWTDTO(token));
        }


            // var emailService = new EmailService();
            // // await emailService.SendEmailAsync("angelsheinen.cambarijan@cit.edu", "Lexi Learn", "Bang");
            // // await emailService.SendEmailAsync("charlene.repuesto@cit.edu", "Lexi Learn", "Bang");
            // // await emailService.SendEmailAsync("deo.talip@cit.edu", "Lexi Learn", "Bang");
            // await emailService.SendEmailAsync("jake.bajo@cit.edu", "Lexi Learn", "Bang");
            //
            // // await emailService.SendEmailAsync("jakebajo11@gmail.com", "Lexi Learn", "Bang");

        public async Task<ResponseDTO> GetUserProfile(ClaimsPrincipal token){
            User? user = await GetUserFromToken(token);
            string role = await GetRole(user);
            
            var response = new SuccessResponseDTO("User profile fetched successfully", null);
            
            if (role == "Pupil")
            {
                Pupil? pupil = await _cachedUserRepository.GetPupilByUserId(user.Id);
                response.Data = new PupilProfileDTO(user, pupil);
            }

            else if (role == "Teacher")
            {
                Teacher? teacher = await _cachedUserRepository.GetTeacherByUserId(user.Id);
                response.Data = new TeacherProfileDTO(user, teacher);
            }else{
                response.Message = "User has not yet selected a role.";
                response.StatusCode = 204;
            }

            return response;
        }

        public async Task<ResponseDTO> GetPublicProfile(string Username){
            User? user = await _cachedUserRepository.GetUserByUsername(Username);

            if(user == null){
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "User Profile Fetched Failed",
                    StatusCodes.Status404NotFound
                );
            }

            var response = new SuccessResponseDTO("User profile fetched successfully", null);

            string role = await GetRole(user);
            
            if (role == "Pupil")
            {
                Pupil? pupil = await _cachedUserRepository.GetPupilByUserId(user.Id);
                response.Data = new PupilProfileDTO(user, pupil, true);
            }

            else if (role == "Teacher")
            {
                Teacher? teacher = await _cachedUserRepository.GetTeacherByUserId(user.Id);
                response.Data = new TeacherProfileDTO(user, teacher, true);
            }else{
                response.Message = "User has not yet selected a role.";
                response.StatusCode = 204;
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

        public async Task<ResponseDTO> UpdateProfile(UpdateProfileDTO UpdateProfileDTO, ClaimsPrincipal User){
            User? user = await GetUserFromToken(User);
            Console.WriteLine(user);

            bool update = false;
            if (!string.IsNullOrEmpty(UpdateProfileDTO.UserName))
                user.UserName = UpdateProfileDTO.UserName;

            if (!string.IsNullOrEmpty(UpdateProfileDTO.FirstName))
                user.FirstName = UpdateProfileDTO.FirstName;

            if (!string.IsNullOrEmpty(UpdateProfileDTO.LastName))
                user.LastName = UpdateProfileDTO.LastName;

            if (UpdateProfileDTO.TwoFactorEnabled != null)
                user.TwoFactorEnabled = UpdateProfileDTO.TwoFactorEnabled ?? false;

            if (!string.IsNullOrEmpty(UpdateProfileDTO.PhoneNumber))
                user.PhoneNumber = UpdateProfileDTO.PhoneNumber;

            // JsonSerializer.Deserialize<User>(JsonSerializer.Serialize(user)) 
            // TODO: ABOVE IS JUST A TEMPORARY FIX TO AVOID TRACKING PROBLEMS
            await _cachedUserRepository.Update(user);

            string role = await GetRole(user);
            
            if(!string.IsNullOrEmpty(UpdateProfileDTO.Role.ToString())){
                if(role != null){
                    throw new ApplicationExceptionBase(
                        $"Role for this user has already been set",
                        "User Profile Update Failed",
                        StatusCodes.Status409Conflict
                    );
                } 
                // JsonSerializer.Deserialize<User>(JsonSerializer.Serialize(user)) 
                // TODO: ABOVE IS JUST A TEMPORARY FIX TO AVOID TRACKING PROBLEMS
                await _cachedUserRepository.CreateProfile(
                        JsonSerializer.Deserialize<User>(JsonSerializer.Serialize(user)), 
                        UpdateProfileDTO.Role.ToString()
                );
                role = UpdateProfileDTO.Role.ToString();
            }


            var response = new SuccessResponseDTO
            {
                Message = "Profile Updated",
                Data = null
            };


            if (role == "Pupil")
            {
                Pupil? pupil = await _cachedUserRepository.GetPupilByUserId(user.Id);

                if (UpdateProfileDTO.Age != null)
                    pupil.Age = UpdateProfileDTO.Age;

                if (UpdateProfileDTO.GradeLevel != null)
                    pupil.GradeLevel = UpdateProfileDTO.GradeLevel;

                await _cachedUserRepository.Update(pupil);
                response.Data = new PupilProfileDTO(user, pupil);
            }
            else if (role == "Teacher")
            {
                Teacher? teacher = await _cachedUserRepository.GetTeacherByUserId(user.Id);

                await _cachedUserRepository.Update(teacher);
                response.Data = new TeacherProfileDTO(user, teacher);
            }

            return response;
        }
    }
}
