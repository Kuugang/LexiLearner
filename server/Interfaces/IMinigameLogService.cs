using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
  public interface IMinigameLogService
  {
    Task<MinigameLogDTO> GetMinigameLogById(Guid id);
    Task<MinigameLogDTO> Create(MinigameType minigameType, MinigameLogDTO.Create request);
  }
}
