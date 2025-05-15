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
        private readonly IReadingSessionService _readingSessionService;

        public AchievementService(IUserService userService, IAchievementRepository achievementRepository, IReadingSessionService readingSessionService)
        {
            _userService = userService;
            _achievementRepository = achievementRepository;
            _readingSessionService = readingSessionService;
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


        public async Task<PupilAchievement?> AddPupilAchievement(Pupil Pupil, string AchievementName)
        {
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


        public async Task<PupilAchievement?> GetByName(Pupil Pupil, string AchievementName)
        {
            return await _achievementRepository.GetByName(Pupil, AchievementName);
        }

        public async Task<List<PupilAchievement>> AddBooksReadAchievement(Pupil Pupil)
        {
            var booksRead = await _readingSessionService.GetReadingMaterialsRead(Pupil.Id);

            var achievementMilestones = new Dictionary<int, string>
            {
                { 3, "Page Turner" },
                { 5, "Avid Reader" },
                { 10, "Story Seeker" },
                { 20, "Book Explorer" },
                { 30, "Book Master" }
            };
            Console.WriteLine("Books read Count: " + booksRead.Count);

            var addedAchievements = new List<PupilAchievement>();

            foreach (var milestone in achievementMilestones)
            {
                if (booksRead.Count >= milestone.Key)
                {
                    var existing = await GetByName(Pupil, milestone.Value);
                    if (existing == null)
                    {
                        var pupilAchievement = await AddPupilAchievement(Pupil, milestone.Value);
                        addedAchievements.Add(pupilAchievement);
                    }
                }
            }

            return addedAchievements;
        }
    }
}
