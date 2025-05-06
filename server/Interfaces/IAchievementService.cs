using System.Security.Claims;
using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
    public interface IAchievementService
    {
        Task<List<Achievement>> GetByPupilId(ClaimsPrincipal Token);
        Task<PupilAchievement> AddPupilAchievement(ClaimsPrincipal Token, string AchievementName);
    }
}
