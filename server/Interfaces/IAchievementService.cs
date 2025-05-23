using System.Security.Claims;
using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
    public interface IAchievementService
    {
        Task<List<Achievement>> GetByPupilId(ClaimsPrincipal Token);
        Task<PupilAchievement> AddPupilAchievement(ClaimsPrincipal Token, string AchievementName);
        Task<PupilAchievement?> AddPupilAchievement(Pupil Pupil, string AchievementName);
        Task<PupilAchievement?> GetByName(Pupil Pupil, string AchievementName);
        Task<List<PupilAchievement>> AddBooksReadAchievement(Pupil Pupil);
    }
}
