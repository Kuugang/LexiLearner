using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Text.Json;


using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Interfaces;
using LexiLearner.Exceptions;

namespace LexiLearner.Services
{
    public class UserService : IUserService
    {

        private readonly UserManager<User> _userManager;
        private readonly IUserRepository _userRepository;
        // private readonly CachedUserRepository _userRepository;
        private readonly ITwoFactorAuthService _twoFactorAuthService;
        private readonly IJWTService _jwtService;

        public UserService(UserManager<User> userManager, IUserRepository userRepository, ITwoFactorAuthService twoFactorAuthService, IJWTService jwtService)
        {
            _userManager = userManager;
            _userRepository = userRepository;
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
            return await _userRepository.GetUserByIdAsync(userId);
        }
        public async Task<User?> GetUserByEmail(string email)
        {
            return await _userRepository.GetUserByEmail(email);
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            return await _userRepository.GetUserByUsername(username);
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
            user = await _userRepository.Create(user, RegisterRequest.Password);
            await _userRepository.CreateProfile(user, RegisterRequest.Role);

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

        public async Task<ResponseDTO> GetUserProfile(ClaimsPrincipal token)
        {
            User? user = await GetUserFromToken(token);
            string role = await GetRole(user);

            var response = new SuccessResponseDTO("User profile fetched successfully", null);

            if (role == "Pupil")
            {
                Pupil? pupil = await _userRepository.GetPupilByUserId(user.Id);
                response.Data = new ProfileDTO(user, pupil);
            }

            else if (role == "Teacher")
            {
                Teacher? teacher = await _userRepository.GetTeacherByUserId(user.Id);
                response.Data = new ProfileDTO(user, teacher);
            }
            else
            {
                response.Message = "User has not yet selected a role.";
                response.StatusCode = 204;
            }

            return response;
        }

        public async Task<ResponseDTO> GetPublicProfile(string Username)
        {
            User? user = await _userRepository.GetUserByUsername(Username);

            if (user == null)
            {
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
                Pupil? pupil = await _userRepository.GetPupilByUserId(user.Id);
                if (pupil == null)
                {
                    throw new ApplicationExceptionBase(
                        $"User does not exist",
                        "User Profile Fetched Failed",
                        StatusCodes.Status404NotFound
                    );
                }

                response.Data = new ProfileDTO(user, pupil, true);
            }

            else if (role == "Teacher")
            {
                Teacher? teacher = await _userRepository.GetTeacherByUserId(user.Id);
                if (teacher == null)
                {
                    throw new ApplicationExceptionBase(
                        $"User does not exist",
                        "User Profile Fetched Failed",
                        StatusCodes.Status404NotFound
                    );
                }
                response.Data = new ProfileDTO(user, teacher, true);
            }
            else
            {
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

        public async Task<ResponseDTO> UpdateProfile(UpdateProfileDTO UpdateProfileDTO, ClaimsPrincipal User)
        {
            User? user = await GetUserFromToken(User);

            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "User Profile Fetched Failed",
                    StatusCodes.Status404NotFound
                );
            }
            bool update = false;

            if (!string.IsNullOrEmpty(UpdateProfileDTO.UserName))
            {
                user.UserName = UpdateProfileDTO.UserName;
                user.NormalizedUserName = _userManager.NormalizeName(UpdateProfileDTO.UserName);
                update = true;
            }

            if (!string.IsNullOrEmpty(UpdateProfileDTO.FirstName))
            {
                user.FirstName = UpdateProfileDTO.FirstName;
                update = true;
            }

            if (!string.IsNullOrEmpty(UpdateProfileDTO.LastName))
            {
                user.LastName = UpdateProfileDTO.LastName;
                update = true;
            }

            if (UpdateProfileDTO.TwoFactorEnabled != null)
            {
                user.TwoFactorEnabled = UpdateProfileDTO.TwoFactorEnabled ?? false;
                update = true;
            }

            if (!string.IsNullOrEmpty(UpdateProfileDTO.PhoneNumber))
            {
                user.PhoneNumber = UpdateProfileDTO.PhoneNumber;
                update = true;
            }

            if (update) //TODO: should use entity state
            {
                user.UpdatedAt = DateTime.UtcNow;
                await _userRepository.Update(user);
            }

            string role = await GetRole(user);

            if (!string.IsNullOrEmpty(UpdateProfileDTO.Role.ToString()))
            {
                if (role != null)
                {
                    throw new ApplicationExceptionBase(
                        $"Role for this user has already been set",
                        "User Profile Update Failed",
                        StatusCodes.Status409Conflict
                    );
                }
                // JsonSerializer.Deserialize<User>(JsonSerializer.Serialize(user)) 
                // TODO: ABOVE IS JUST A TEMPORARY FIX TO AVOID TRACKING PROBLEMS
                await _userRepository.CreateProfile(
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
                Pupil? pupil = await _userRepository.GetPupilByUserId(user.Id);

                if (UpdateProfileDTO.Age != null)
                    pupil.Age = UpdateProfileDTO.Age;

                if (UpdateProfileDTO.GradeLevel != null)
                    pupil.GradeLevel = UpdateProfileDTO.GradeLevel;

                await _userRepository.Update(pupil);
                response.Data = new ProfileDTO(user, pupil);
            }
            else if (role == "Teacher")
            {
                Teacher? teacher = await _userRepository.GetTeacherByUserId(user.Id);

                await _userRepository.Update(teacher);
                response.Data = new ProfileDTO(user, teacher);
            }

            return response;
        }

        public async Task<ResponseDTO> DeleteAccount(ClaimsPrincipal userPrincipal)
        {
            User? user = await GetUserFromToken(userPrincipal);

            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "User Profile Fetched Failed",
                    StatusCodes.Status404NotFound
                );
            }

            await _userRepository.DeleteAccount(user);
            return new SuccessResponseDTO("Account Deleted Successfully");
        }
    }
}
