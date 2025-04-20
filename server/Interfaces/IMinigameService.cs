using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
  public interface IMinigameService
  {
    Task<MinigameDTO> Create(MinigameType minigameType, MinigameDTO.Create request);
    Task<MinigameDTO> GetMinigameById(Guid id);
    Task<List<MinigameDTO>> GetMinigames();
    Task<List<MinigameDTO>> GetMinigamesByRMId(Guid readingMatId);
  }
}
