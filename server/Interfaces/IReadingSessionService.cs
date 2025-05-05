using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
    public interface IReadingSessionService
    {
        Task<ReadingSession?> GetReadingSessionById(Guid ReadingSessionId);
        Task<List<ReadingSession>> GetReadingSessionByReadingMaterialId(Guid ReadingMaterialId);
    }
}
