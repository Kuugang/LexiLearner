using LexiLearner.Interfaces;


using LexiLearner.Models;

namespace LexiLearner.Services
{
    public class ReadingSessionService : IReadingSessionService
    {
        private readonly IReadingSessionRepository _readingSessionRepository;
        public ReadingSessionService(IReadingSessionRepository readingSessionRepository)
        {
            _readingSessionRepository = readingSessionRepository;
        }

        public async Task<ReadingSession?> GetReadingSessionById(Guid ReadingSessionId)
        {
            return await _readingSessionRepository.GetReadingSessionById(ReadingSessionId);
        }


        public async Task<List<ReadingSession>> GetReadingSessionByReadingMaterialId(Guid ReadingMaterialId)
        {
            return await _readingSessionRepository.GetReadingSessionByReadingMaterialId(ReadingMaterialId);
        }
    }
}

