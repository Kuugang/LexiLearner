using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;

namespace LexiLearner.Repository {
    public class AchievementRepository : IAchievementRepository
    {
        private readonly DataContext _context;
        public AchievementRepository(DataContext context) {
            _context = context;
        }

        public async Task AddPupilAchievement(PupilAchievement achievement)
        {
            await _context.PupilAchievement.AddAsync(achievement);
            await _context.SaveChangesAsync();
        }

        public Task<Achievement> GetById(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Achievement>> GetByPupilId(Guid Id)
        {
            throw new NotImplementedException();
        }
    }
}