using LexiLearner.Models;
namespace LexiLearner.Interfaces {
    public interface IAchievementRepository {
        Task<Achievement> GetById(Guid Id);
        Task<List<Achievement>> GetByPupilId(Guid Id);
        Task AddPupilAchievement(PupilAchievement achievement);
    }
}