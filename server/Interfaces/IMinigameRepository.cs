using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
    public interface IMinigameRepository
    {
        Task<Minigame> Create(Minigame minigame);
        Task<Minigame?> GetMinigameById(Guid id);
        Task<List<Minigame>> GetMinigames();
        Task<List<Minigame>> GetMinigamesByRMId(Guid readingMatId);

        Task<MinigameLog?> GetMinigameLogById(Guid id);
        Task<MinigameLog> Create(MinigameLog minigameLog);
        Task<List<MinigameLog>> GetMinigameLogs();
        Task<List<MinigameLog>> GetMinigameLogsByRMId(Guid readingMatId);

        Task<List<MinigameLog>> GetMinigameLogByReadingSessionId(Guid SessionId);

        Task Complete(Pupil Pupil);
        Task<List<Minigame>> GetMinigamesByRMIdAndType(Guid readingMaterialId, MinigameType minigameType);
        Task<MinigameLog?> GetMinigameLogByMIdRSId(Guid ReadingSessionId, Guid MinigameId);
    }
}
