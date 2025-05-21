using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
    public interface IMinigameService
    {
        Task<MinigameDTO> Create(MinigameType minigameType, MinigameDTO.Create request);
        Task<MinigameDTO> GetMinigameById(Guid id);
        Task<List<MinigameDTO>> GetMinigames();
        Task<List<MinigameDTO>> GetRandomMinigamesByRMId(Guid readingMaterialId);
        Task<List<MinigameDTO>> GetRandomMinigames(Guid readingSessionId);
        Task<List<MinigameDTO>> GetMinigamesByRMId(Guid readingMatId);

        Task<MinigameLogDTO> GetMinigameLogById(Guid id);
        Task<MinigameLogDTO> Create(MinigameType minigameType, MinigameLogDTO request);
        Task<List<MinigameLogDTO>> GetMinigameLogs();
        Task<List<MinigameLogDTO>> GetMinigameLogsByRMId(Guid readingMatId);
        Task<List<MinigameLog>> GetMinigameLogByReadingSessionId(Guid SessionId);
        Task<CompleteReadingSessionDTO> Complete(Guid SessionId);
        Task<List<MinigameDTO>> GetMinigamesByRMIdAndType(Guid readingMaterialId, MinigameType minigameType);
        Task<MinigameLogDTO> GetMinigameLogByMIdRSId(Guid ReadingSessionId, Guid MinigameId);
    }
}
