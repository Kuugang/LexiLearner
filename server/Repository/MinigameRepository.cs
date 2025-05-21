using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using Microsoft.EntityFrameworkCore;
namespace LexiLearner.Repository
{
    public class MinigameRepository(DataContext dataContext) : IMinigameRepository
    {
        private readonly DataContext _dataContext = dataContext;

        public async Task<Minigame> Create(Minigame minigame)
        {
            await _dataContext.Minigame.AddAsync(minigame);
            await _dataContext.SaveChangesAsync();
            return minigame;
        }

        public async Task<Minigame?> GetMinigameById(Guid id)
        {
            return await _dataContext.Minigame.FirstOrDefaultAsync(mg => mg.Id == id);
        }

        public async Task<List<Minigame>> GetMinigames()
        {
            return await _dataContext.Minigame.ToListAsync();
        }

        public async Task<List<Minigame>> GetMinigamesByRMId(Guid readingMatId)
        {
            return await _dataContext.Minigame.Where(mg => mg.ReadingMaterialId == readingMatId).ToListAsync();
        }


        public async Task<MinigameLog> Create(MinigameLog minigameLog)
        {
            await _dataContext.MinigameLog.AddAsync(minigameLog);
            await _dataContext.SaveChangesAsync();
            return minigameLog;
        }

        public async Task<MinigameLog?> GetMinigameLogById(Guid id)
        {
            return await _dataContext.MinigameLog.FirstOrDefaultAsync(mgl => mgl.Id == id);
        }

        public async Task<List<MinigameLog>> GetMinigameLogs()
        {
            return await _dataContext.MinigameLog.ToListAsync();
        }

        public async Task<List<MinigameLog>> GetMinigameLogsByRMId(Guid readingMatId)
        {
            return await _dataContext.MinigameLog.Where(mgl => mgl.Minigame.ReadingMaterialId == readingMatId).ToListAsync();
        }

        public async Task<List<MinigameLog>> GetMinigameLogByReadingSessionId(Guid ReadingSessionId)
        {
            return await _dataContext.MinigameLog
                .Include(mgl => mgl.Minigame)
                .Where(mgl => mgl.ReadingSessionId == ReadingSessionId)
                .ToListAsync();
        }


        //TODO: Make a session service for this
        public async Task Complete(Pupil Pupil)
        {
            _dataContext.Update(Pupil);
            await _dataContext.SaveChangesAsync();
        }
        
        public async Task<List<Minigame>> GetMinigamesByRMIdAndType(Guid readingMaterialId, MinigameType minigameType)
        {
            return await _dataContext.Minigame
                .Where(mg => mg.ReadingMaterialId == readingMaterialId && mg.MinigameType == minigameType)
                .ToListAsync();
        }

        public async Task<MinigameLog?> GetMinigameLogByMIdRSId(Guid ReadingSessionId, Guid MinigameId)
        {
            return await _dataContext.MinigameLog.FirstOrDefaultAsync(mgl => mgl.MinigameId == MinigameId && mgl.ReadingSessionId == ReadingSessionId);
        }
    }
}
