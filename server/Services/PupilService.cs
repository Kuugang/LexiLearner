using System.Security.Claims;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Services
{
    public class PupilService : IPupilService
    {
        private readonly IPupilRepository _pupilRepository;
        private readonly IUserService _userService;
        public PupilService(IPupilRepository pupilRepository, IUserService userService)
        {
            _pupilRepository = pupilRepository;
            _userService = userService;
        }

        public async Task<Pupil?> GetPupilById(Guid Id)
        {
            return await _pupilRepository.GetPupilByIdAsync(Id);
        }

        public async Task<Pupil?> GetPupilByUserId(string UserId)
        {
            return await _pupilRepository.GetPupilByUserIdAsync(UserId);
        }
    
        public async Task<LoginStreak?> GetLoginStreak(ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);

            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Fetching login streak failed.", StatusCodes.Status404NotFound);
            }

            Pupil? pupil = await GetPupilByUserId(user.Id);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase("Pupil not found.", "Fetching login streak failed.", StatusCodes.Status404NotFound);
            }

            return await _pupilRepository.GetLoginStreak(pupil.Id);
        }

        public async Task<LoginStreak> RecordLoginAsync(string UserId)
        {
            var user = await _userService.GetUserByIdAsync(UserId);

            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Recording login failed.", StatusCodes.Status404NotFound);
            }

            Pupil? pupil = await GetPupilByUserId(UserId);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase("Pupil not found.", "Recording login failed.", StatusCodes.Status404NotFound);
            }

            var loginStreak = await _pupilRepository.GetLoginStreak(pupil.Id);
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

                loginStreak = await _pupilRepository.CreateLoginStreak(loginStreak);
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

                await _pupilRepository.Update(loginStreak);
            }

            return loginStreak;
        }
    
        public async Task<List<PupilLeaderboard>> GetPupilLeaderboardByPupilId(Guid PupilId)
        {
            return await _pupilRepository.GetPupilLeaderboardByPupilId(PupilId);
        }

        public async Task<PupilLeaderboard> CreatePupilLeaderboardEntry(PupilLeaderboardDTO.Create Request)
        {
            Pupil? pupil = await GetPupilById(Request.PupilId);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase("Pupil not found", "Failed to create leaderboard entry", StatusCodes.Status404NotFound);
            }

            PupilLeaderboard pupilLeaderboard = new PupilLeaderboard
            {
                PupilId = Request.PupilId,
                Pupil = pupil,
                Level = Request.Level
            };

            pupilLeaderboard = await _pupilRepository.CreatePupilLeaderboardEntry(pupilLeaderboard);
            return pupilLeaderboard;
        }

        public Task<List<PupilLeaderboard>> GetGlobal10Leaderboard()
        {
            return _pupilRepository.GetGlobal10Leaderboard();
        }

        public async Task<List<PupilLeaderboard>> GetPupilLeaderboard(ClaimsPrincipal User)
        {
            User? user = _userService.GetUserFromToken(User).Result;
            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Fetching leaderboard failed.", StatusCodes.Status404NotFound);
            }

            Pupil? pupil = GetPupilByUserId(user.Id).Result;
            if (pupil == null)
            {
                throw new ApplicationExceptionBase("Pupil not found.", "Fetching leaderboard failed.", StatusCodes.Status404NotFound);
            }

            var leaderboardHist = await _pupilRepository.GetPupilLeaderboardByPupilId(pupil.Id);
            return leaderboardHist;
        }
    }
}
