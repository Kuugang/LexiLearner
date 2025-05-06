using System.Security.Claims;

using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Exceptions;

namespace LexiLearner.Services
{
    public class AchievementService : IAchievementService
    {
        private readonly IUserService _userService;
        private readonly IAchievementRepository _achievementRepository;

        public AchievementService(IUserService userService, IAchievementRepository achievementRepository)
        {
            _userService = userService;
            _achievementRepository = achievementRepository;
        }

        public async Task<List<Achievement>> GetByPupilId(ClaimsPrincipal Token)
        {
            var User = await _userService.GetUserFromToken(Token);

            if (User == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Get Achievements Failed",
                    StatusCodes.Status404NotFound
                );
            }
            var Pupil = await _userService.GetPupilByUserId(User.Id);
            return await _achievementRepository.GetAchivementsByPupilId(Pupil.Id);
        }


        public async Task<PupilAchievement> AddPupilAchievement(ClaimsPrincipal Token, string AchievementName)
        {
            var User = await _userService.GetUserFromToken(Token);

            if (User == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Get Achievements Failed",
                    StatusCodes.Status404NotFound
                );
            }
            var Pupil = await _userService.GetPupilByUserId(User.Id);
            var Achievement = await _achievementRepository.GetAchivementByName(AchievementName);

            if (Achievement == null)
            {
                throw new ApplicationExceptionBase(
                    $"Achievement does not exist",
                    "Add Achievement  Failed",
                    StatusCodes.Status404NotFound
                );
            }

            var PupilAchievement = new PupilAchievement
            {
                PupilId = Pupil.Id,
                Pupil = Pupil,
                Achievement = Achievement,
                AchievementId = Achievement.Id
            };

            await _achievementRepository.AddPupilAchievement(PupilAchievement);
            return PupilAchievement;
        }
    }
}
