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
        private readonly IFileUploadService _fileUploadService;

        public UserService(UserManager<User> userManager, IUserRepository userRepository, IFileUploadService fileUploadService)
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _fileUploadService = fileUploadService;
        }

        public async Task<IEnumerable<User>> SearchUsersByRoleAsync(string Role, string SearchTerm)
        {
            var usersInRole = await _userManager.GetUsersInRoleAsync(Role);

            if (string.IsNullOrWhiteSpace(SearchTerm))
            {
                return usersInRole;
            }

            SearchTerm = SearchTerm.ToLower();
            var filteredUsers = usersInRole.Where(u =>
                (u.UserName != null && u.UserName.ToLower().Contains(SearchTerm)) ||
                (u.Email != null && u.Email.ToLower().Contains(SearchTerm)) ||
                u.FirstName.ToLower().Contains(SearchTerm) ||
                u.LastName.ToLower().Contains(SearchTerm)
            ).ToList();

            if (Role == "Pupil")
            {
                foreach (var user in filteredUsers)
                {
                    if (user.Pupil == null)
                    {
                        user.Pupil = await _userRepository.GetPupilByUserId(user.Id);
                    }
                }
            }

            return filteredUsers;
        }

        public async Task<string> GetRole(User User)
        {
            var roles = await _userManager.GetRolesAsync(User);
            return roles.FirstOrDefault();
        }

        public async Task<User?> GetUserByIdAsync(string UserId)
        {
            return await _userRepository.GetUserByIdAsync(UserId);
        }

        public async Task<Pupil?> GetPupilByUserId(string UserId)
        {
            return await _userRepository.GetPupilByUserId(UserId);
        }

        public async Task<Teacher?> GetTeacherByUserId(string UserId)
        {
            return await _userRepository.GetTeacherByUserId(UserId);
        }

        public async Task<User?> GetUserByEmail(string Email)
        {
            return await _userRepository.GetUserByEmail(Email);
        }

        public async Task<User?> GetUserByUsername(string Username)
        {
            return await _userRepository.GetUserByUsername(Username);
        }

        public async Task<ResponseDTO> GetUserProfile(ClaimsPrincipal Token)
        {
            User? user = await GetUserFromToken(Token);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "User Profile Fetched Failed",
                    StatusCodes.Status404NotFound
                );
            }
            string role = await GetRole(user);

            var response = new SuccessResponseDTO("User profile fetched successfully", null);

            if (role == "Pupil")
            {
                Pupil? pupil = await GetPupilByUserId(user.Id);
                response.Data = new ProfileDTO(user, pupil);
            }

            else if (role == "Teacher")
            {
                Teacher? teacher = await GetTeacherByUserId(user.Id);
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
                Pupil? pupil = await GetPupilByUserId(user.Id);
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
                Teacher? teacher = await GetTeacherByUserId(user.Id);
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

        public async Task<User?> GetUserFromToken(ClaimsPrincipal Principal)
        {
            if (Principal == null) return null;
            var userIdClaim = Principal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return null;

            var userId = userIdClaim.Value;
            return await GetUserByIdAsync(userId);
        }
        
        public async Task<User?> GetUserFromTokenTracked(ClaimsPrincipal Principal)
        {
            if (Principal == null) return null;
            var userIdClaim = Principal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return null;

            var userId = userIdClaim.Value;
            return await _userRepository.GetUserByIdTrackedAsync(userId);
        }

        public async Task<ResponseDTO> UpdateProfile(UpdateProfileDTO UpdateProfileDTO, ClaimsPrincipal User)
        {
            User? user = await GetUserFromTokenTracked(User);

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

            if (UpdateProfileDTO.Avatar != null)
            {
                user.Avatar = _fileUploadService.Upload(UpdateProfileDTO.Avatar, "Avatar\\");
                update = true;
            }
            
            if (!string.IsNullOrEmpty(UpdateProfileDTO.Password))
            {
                IdentityResult passwordResult;

                if (!string.IsNullOrEmpty(UpdateProfileDTO.CurrentPassword))
                {
                    passwordResult = await _userManager.ChangePasswordAsync(user, UpdateProfileDTO.CurrentPassword, UpdateProfileDTO.Password);
                }
                else
                {
                    if (await _userManager.HasPasswordAsync(user))
                    {
                        throw new ApplicationExceptionBase(
                            "Current password is required to change password.",
                            "Password Update Failed",
                            StatusCodes.Status400BadRequest
                        );
                    }

                    passwordResult = await _userManager.AddPasswordAsync(user, UpdateProfileDTO.Password);
                }

                if (!passwordResult.Succeeded)
                {
                    string errors = string.Join("; ", passwordResult.Errors.Select(e => e.Description));
                    throw new ApplicationExceptionBase(
                        errors,
                        "Password Update Failed",
                        StatusCodes.Status400BadRequest
                    );
                }

                update = true;
            }

            if (update) //TODO: should use entity state
            {
                user.UpdatedAt = DateTime.UtcNow;
                await _userRepository.Update(user);
            }

            string role = await GetRole(user);
            string token = null;

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
                Pupil? pupil = await GetPupilByUserId(user.Id);

                if (UpdateProfileDTO.Age != null)
                    pupil.Age = UpdateProfileDTO.Age;

                if (UpdateProfileDTO.GradeLevel != null)
                    pupil.GradeLevel = UpdateProfileDTO.GradeLevel;

                await _userRepository.Update(pupil);
                response.Data = new ProfileDTO(user, pupil);
            }
            else if (role == "Teacher")
            {
                Teacher? teacher = await GetTeacherByUserId(user.Id);

                await _userRepository.Update(teacher);
                response.Data = new ProfileDTO(user, teacher);
            }

            return response;
        }

        public async Task<ResponseDTO> DeleteAccount(ClaimsPrincipal UserPrincipal)
        {
            User? user = await GetUserFromToken(UserPrincipal);

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

        public async Task<Pupil?> GetPupilByPupilId(Guid PupilId)
        {
            Console.WriteLine($"oten PupilId: {PupilId}");
            return await _userRepository.GetPupilByPupilId(PupilId);
        }

        public async Task<SessionDTO> CreateSession(ClaimsPrincipal User)
        {
            User? user = await GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Creating session failed.", StatusCodes.Status404NotFound);
            }

            var session = new Session
            {
                UserId = user.Id,
                User = user
            };

            session = await _userRepository.CreateSession(session);
            return new SessionDTO(session);
        }

        public async Task<SessionDTO> EndSession(Guid SessionId, ClaimsPrincipal User)
        {
            User? user = await GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Ending session failed.", StatusCodes.Status404NotFound);
            }

            var session = await _userRepository.GetSessionById(SessionId);
            if (session == null)
            {
                throw new ApplicationExceptionBase("Session not found.", "Ending session failed.", StatusCodes.Status404NotFound);
            }

            if (session.UserId != user.Id)
            {
                throw new ApplicationExceptionBase("Unauthorized.", "Ending session failed.", StatusCodes.Status403Forbidden);
            }

            session.EndAt = DateTime.UtcNow;
            session.Duration = (int?)(session.EndAt - session.CreatedAt).TotalMinutes;

            await _userRepository.Update(session);
            return new SessionDTO(session);
        }

        public async Task<Session?> GetSessionById(Guid SessionId, ClaimsPrincipal User)
        {
            User? user = await GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Fetching session failed.", StatusCodes.Status404NotFound);
            }

            var session = await _userRepository.GetSessionById(SessionId);
            if (session == null)
            {
                throw new ApplicationExceptionBase("Session not found.", "Fetching session failed.", StatusCodes.Status404NotFound);
            }

            if (session.UserId != user.Id)
            {
                throw new ApplicationExceptionBase("Unauthorized.", "Fetching session failed.", StatusCodes.Status403Forbidden);
            }

            return session;
        }

        public async Task<List<Session>> GetSessionsByUserId(string UserId)
        {
            return await _userRepository.GetSessionsByUserId(UserId);
        }
    }

}
