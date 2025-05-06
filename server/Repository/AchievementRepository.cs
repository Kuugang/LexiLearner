using Microsoft.EntityFrameworkCore;
using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;

namespace LexiLearner.Repository
{
    public class AchievementRepository : IAchievementRepository
    {
        private readonly DataContext _context;
        public AchievementRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Achievement?> GetAchivementByName(string Name)
        {
            return await _context.Achievement.FirstOrDefaultAsync(a => a.Name == Name);
        }

        public async Task<List<Achievement>> GetAchivementsByPupilId(Guid PupilId)
        {
            return await _context.PupilAchievement
                .Where(pa => pa.PupilId == PupilId)
                .Select(pa => pa.Achievement)
                .ToListAsync();
        }

        public async Task AddPupilAchievement(PupilAchievement achievement)
        {
            await _context.PupilAchievement.AddAsync(achievement);
            await _context.SaveChangesAsync();
        }
    }
}
