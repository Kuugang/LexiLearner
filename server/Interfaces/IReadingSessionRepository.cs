using System.Security.Claims;
using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
    public interface IReadingSessionRepository
    {
        Task<ReadingSession?> GetReadingSessionById(Guid ReadingSessionId);
        Task<List<ReadingSession>> GetReadingSessionByReadingMaterialId(Guid ReadingMaterialId);
        Task<ReadingSession> Create(ReadingSession ReadingSession);
        Task Update(ReadingSession ReadingSession);
        Task<List<ReadingMaterial>> GetReadingMaterialsRead(Guid PupilId);
        Task<List<ReadingSession>> GetIncompleteReadingSessionsByPupilId(Guid PupilId);
        Task<List<ReadingMaterial>> GetIncompleteReadingMaterialsByPupilId(Guid PupilId);
    }
}
