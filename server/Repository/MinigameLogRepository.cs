using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using Microsoft.EntityFrameworkCore;

namespace LexiLearner.Repository
{
  public class MinigameLogRepository(DataContext dataContext) : IMinigameLogRepository
  {
    private readonly DataContext _dataContext = dataContext;
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

    public async Task<List<MinigameLog>> GetMinigamesByRMId(Guid readingMatId)
    {
      return await _dataContext.MinigameLog.Where(mgl => mgl.Minigame.ReadingMaterialId == readingMatId).ToListAsync();
    }
  }
}
