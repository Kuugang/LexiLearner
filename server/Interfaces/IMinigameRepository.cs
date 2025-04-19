using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IMinigameRepository
  {
    Task<Minigame> Create (Minigame minigame);
    Task<Minigame> GetMinigameById(Guid id);
  }
}
