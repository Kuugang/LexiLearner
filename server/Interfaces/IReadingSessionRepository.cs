using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
    public interface IReadingSessionRepository
    {
        Task<ReadingSession?> GetReadingSessionById(Guid ReadingSessionId);
        Task<List<ReadingSession>> GetReadingSessionByReadingMaterialId(Guid ReadingMaterialId);
    }
}
