using Microsoft.EntityFrameworkCore;

using LexiLearner.Models;
using LexiLearner.Data;
using LexiLearner.Interfaces;
using System.Security.Claims;

namespace LexiLearner.Repository
{
    public class ReadingSessionRepository : IReadingSessionRepository
    {
        private readonly DataContext _context;

        public ReadingSessionRepository(DataContext context)
        {
            _context = context;
        }

		public async Task<ReadingSession> Create(ReadingSession ReadingSession)
		{
			await _context.ReadingSession.AddAsync(ReadingSession);
            await _context.SaveChangesAsync();
            return ReadingSession;
		}

		public async Task<ReadingSession?> GetReadingSessionById(Guid ReadingSessionId)
        {
            return await _context.ReadingSession.FirstOrDefaultAsync(rs => rs.Id == ReadingSessionId);
        }

        public async Task<List<ReadingSession>> GetReadingSessionByReadingMaterialId(Guid ReadingMaterialId)
        {
            return await _context.ReadingSession.Where(rs => rs.ReadingMaterialId == ReadingMaterialId).ToListAsync();
        }

		public async Task Update(ReadingSession ReadingSession)
		{
			_context.ReadingSession.Update(ReadingSession);
            await _context.SaveChangesAsync();
		}
	}
}
