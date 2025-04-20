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
  }
}
