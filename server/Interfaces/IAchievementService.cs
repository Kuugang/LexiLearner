using System.Security.Claims;
using LexiLearner.Models;

namespace LexiLearner.Interfaces {
    public interface IAchievementService {
        Task<Achievement> GetById(Guid Id);
        Task<List<Achievement>> GetByPupilId(ClaimsPrincipal User);
        Task<Achievement> AddPupilAchievement(ClaimsPrincipal User);
    }
}
