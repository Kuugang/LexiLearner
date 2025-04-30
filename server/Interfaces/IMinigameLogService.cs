using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
  public interface IMinigameLogService
  {
    Task<MinigameLogDTO> GetMinigameLogById(Guid id);
    Task<MinigameLogDTO> Create(MinigameType minigameType, MinigameLogDTO.Create request);
    Task<List<MinigameLogDTO>> GetMinigameLogs();
    Task<List<MinigameLogDTO>> GetMinigameLogsByRMId(Guid readingMatId);
  }
}
