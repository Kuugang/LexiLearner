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
        private readonly IPupilService _pupilService;
        // private readonly CachedUserRepository _userRepository;
        private readonly ITwoFactorAuthService _twoFactorAuthService;
        private readonly IFileUploadService _fileUploadService;

        public UserService(UserManager<User> userManager, IUserRepository userRepository, ITwoFactorAuthService twoFactorAuthService, IFileUploadService fileUploadService, IPupilService pupilService)
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _twoFactorAuthService = twoFactorAuthService;
            _fileUploadService = fileUploadService;
            _pupilService = pupilService;
        }

        public async Task<IEnumerable<User>> SearchUsersByRoleAsync(string role, string searchTerm)
        {
            var usersInRole = await _userManager.GetUsersInRoleAsync(role);

            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return usersInRole;
            }

            searchTerm = searchTerm.ToLower();
            var filteredUsers = usersInRole.Where(u =>
                (u.UserName != null && u.UserName.ToLower().Contains(searchTerm)) ||
                (u.Email != null && u.Email.ToLower().Contains(searchTerm)) ||
                u.FirstName.ToLower().Contains(searchTerm) ||
                u.LastName.ToLower().Contains(searchTerm)
            ).ToList();

            if (role == "Pupil")
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

        public async Task<Pupil?> GetPupilByUserId(string userId)
        {
            return await _userRepository.GetPupilByUserId(userId);
        }

        public async Task<Teacher?> GetTeacherByUserId(string userId)
        {
            return await _userRepository.GetTeacherByUserId(userId);
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _userRepository.GetUserByEmail(email);
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            return await _userRepository.GetUserByUsername(username);
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

            if (UpdateProfileDTO.Avatar != null)
            {
                user.Avatar = _fileUploadService.Upload(UpdateProfileDTO.Avatar, "Avatar\\");
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

        public async Task<LoginStreak?> GetLoginStreak(ClaimsPrincipal user)
        {
            User? User = await GetUserFromToken(user);

            if (User == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Fetching login streak failed.", StatusCodes.Status404NotFound);
            }

            Pupil? pupil = await GetPupilByUserId(User.Id);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase("Pupil not found.", "Fetching login streak failed.", StatusCodes.Status404NotFound);
            }

            return await _userRepository.GetLoginStreak(pupil.Id);
        }

        public async Task<LoginStreak> RecordLoginAsync(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Recording login failed.", StatusCodes.Status404NotFound);
            }

            Pupil? pupil = await _userRepository.GetPupilByUserId(userId);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase("Pupil not found.", "Recording login failed.", StatusCodes.Status404NotFound);
            }

            var loginStreak = await _userRepository.GetLoginStreak(pupil.Id);
            var today = DateTime.UtcNow.Date;

            if (loginStreak == null)
            {
                loginStreak = new LoginStreak
                {
                    PupilId = pupil.Id,
                    Pupil = pupil,
                    CurrentStreak = 1,
                    LastLoginDate = today,
                    LongestStreak = 1
                };

                loginStreak = await _userRepository.CreateLoginStreak(loginStreak);
            }
            else
            {
                var daysSinceLastLogin = (today - loginStreak.LastLoginDate.Date).Days;

                if (daysSinceLastLogin == 0)
                {
                    // User has already logged in today, no need to update streak
                    return loginStreak;
                }

                if (daysSinceLastLogin == 1)
                {
                    loginStreak.CurrentStreak++;

                    if (loginStreak.CurrentStreak > loginStreak.LongestStreak)
                    {
                        loginStreak.LongestStreak = loginStreak.CurrentStreak;
                    }
                }
                else
                {
                    loginStreak.CurrentStreak = 1;
                }

                loginStreak.LastLoginDate = today;

                await _userRepository.Update(loginStreak);
            }

            return loginStreak;
        }

        public async Task<Pupil?> GetPupilByPupilId(Guid pupilId)
        {
            Console.WriteLine($"oten PupilId: {pupilId}");
            return await _userRepository.GetPupilByPupilId(pupilId);
        }

        public async Task<SessionDTO> CreateSession(ClaimsPrincipal user)
        {
            User? User = await GetUserFromToken(user);
            if (User == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Creating session failed.", StatusCodes.Status404NotFound);
            }

            var session = new Session
            {
                UserId = User.Id,
                User = User
            };

            session = await _userRepository.CreateSession(session);
            return new SessionDTO(session);
        }

        public async Task<SessionDTO> EndSession(Guid sessionId, ClaimsPrincipal user)
        {
            User? User = await GetUserFromToken(user);
            if (User == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Ending session failed.", StatusCodes.Status404NotFound);
            }

            var session = await _userRepository.GetSessionById(sessionId);
            if (session == null)
            {
                throw new ApplicationExceptionBase("Session not found.", "Ending session failed.", StatusCodes.Status404NotFound);
            }

            if (session.UserId != User.Id)
            {
                throw new ApplicationExceptionBase("Unauthorized.", "Ending session failed.", StatusCodes.Status403Forbidden);
            }

            session.EndAt = DateTime.UtcNow;
            session.Duration = (int?)(session.EndAt - session.CreatedAt).TotalMinutes;

            await _userRepository.Update(session);
            return new SessionDTO(session);
        }

        public async Task<Session?> GetSessionById(Guid sessionId, ClaimsPrincipal user)
        {
            User? User = await GetUserFromToken(user);
            if (User == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Fetching session failed.", StatusCodes.Status404NotFound);
            }

            var session = await _userRepository.GetSessionById(sessionId);
            if (session == null)
            {
                throw new ApplicationExceptionBase("Session not found.", "Fetching session failed.", StatusCodes.Status404NotFound);
            }

            if (session.UserId != User.Id)
            {
                throw new ApplicationExceptionBase("Unauthorized.", "Fetching session failed.", StatusCodes.Status403Forbidden);
            }

            return session;
        }

        public async Task<List<Session>> GetSessionsByUserId(string userId)
        {
            return await _userRepository.GetSessionsByUserId(userId);
        }

        public async Task<List<PupilLeaderboard>> GetPupilLeaderboardByPupilId(Guid pupilId)
        {
            return await _userRepository.GetPupilLeaderboardByPupilId(pupilId);
        }

        public async Task<PupilLeaderboard> CreatePupilLeaderboardEntry(PupilLeaderboardDTO.Create request)
        {
            Pupil? pupil = await _pupilService.GetPupilById(request.PupilId);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase("Pupil not found", "Failed to create leaderboard entry", StatusCodes.Status404NotFound);
            }

            PupilLeaderboard pupilLeaderboard = new PupilLeaderboard
            {
                PupilId = request.PupilId,
                Pupil = pupil,
                Level = request.Level
            };

            pupilLeaderboard = await _userRepository.CreatePupilLeaderboardEntry(pupilLeaderboard);
            return pupilLeaderboard;
        }

        public Task<List<PupilLeaderboard>> GetGlobal10Leaderboard()
        {
            return _userRepository.GetGlobal10Leaderboard();
        }

        public async Task<List<PupilLeaderboard>> GetPupilLeaderboard(ClaimsPrincipal user)
        {
            User? User = GetUserFromToken(user).Result;
            if (User == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Fetching leaderboard failed.", StatusCodes.Status404NotFound);
            }

            Pupil? pupil = GetPupilByUserId(User.Id).Result;
            if (pupil == null)
            {
                throw new ApplicationExceptionBase("Pupil not found.", "Fetching leaderboard failed.", StatusCodes.Status404NotFound);
            }

            var leaderboardHist = await _userRepository.GetPupilLeaderboardByPupilId(pupil.Id);
            return leaderboardHist;
        }
    }

}
