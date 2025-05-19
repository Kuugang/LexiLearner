using LexiLearner.Models;
namespace LexiLearner.Interfaces
{
    public interface IAchievementRepository
    {
        Task<Achievement?> GetAchivementByName(string name);
        Task<List<Achievement>> GetAchivementsByPupilId(Guid Id);
        Task<PupilAchievement?> GetByName(Pupil Pupil, string AchievementName);
        Task AddPupilAchievement(PupilAchievement achievement);
    }
}
