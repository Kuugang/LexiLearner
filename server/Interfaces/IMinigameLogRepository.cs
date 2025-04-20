using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IMinigameLogRepository
  {
    Task<MinigameLog?> GetMinigameLogById(Guid id);
    Task<MinigameLog> Create(MinigameLog minigameLog);
    Task<List<MinigameLog>> GetMinigameLogs();
    Task<List<MinigameLog>> GetMinigamesByRMId(Guid readingMatId);
  }
}
