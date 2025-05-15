using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
    public interface IReadingSessionService
    {
        Task<ReadingSession?> GetReadingSessionById(Guid ReadingSessionId);
        Task<List<ReadingSession>> GetReadingSessionByReadingMaterialId(Guid ReadingMaterialId);
        Task<ReadingSessionDTO> Create(Guid ReadingMaterialId, ClaimsPrincipal User);
        Task<ReadingSessionDTO> Update(Guid readingSessionId, ReadingSessionDTO.Update request);
        Task<List<ReadingSession>> GetIncompleteReadingSessionsByPupilId(Guid PupilId);
        Task<List<ReadingSession>> GetIncompleteReadingSessionsByPupil(ClaimsPrincipal User);
        Task<List<ReadingMaterial>> GetIncompleteReadingMaterialsByPupil(ClaimsPrincipal User);
    }
}
