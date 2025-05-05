using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace LexiLearner.Repository
{
    public class ReadingMaterialRepository : IReadingMaterialRepository
    {
        private readonly DataContext _dataContext;
        private readonly IGenreService _genreService;
        public ReadingMaterialRepository(DataContext dataContext, IGenreService genreService)
        {
            _dataContext = dataContext;
            _genreService = genreService;
        }

        public async Task<ReadingMaterial> Create(ReadingMaterial readingMaterial)
        {
            await _dataContext.ReadingMaterial.AddAsync(readingMaterial);
            await _dataContext.SaveChangesAsync();
            return readingMaterial;
        }

        public async Task<List<ReadingMaterial>> FilterReadingMaterial(ReadingMaterialDTO.Read filters)
        {
            var query = _dataContext.ReadingMaterial.Include(r => r.ReadingMaterialGenres).ThenInclude(rmg => rmg.Genre).AsQueryable();

            if (filters.Id != null)
            {
                query = query.Where(r => r.Id == filters.Id);
            }

            if (!string.IsNullOrEmpty(filters.Title))
            {
                query = query.Where(r => r.Title.ToLower().Contains(filters.Title.ToLower()));
            }

            if (filters.Genre != null && filters.Genre.Any())
            {
                var genres = await _genreService.GetGenres(filters.Genre);
                var genreIds = genres.Select(g => g.Id).ToList();

                if (genreIds != null)
                {
                    query = query.Where(r => r.ReadingMaterialGenres.Any(rmg => genreIds.Contains(rmg.GenreId)));
                }
            }

            return await query.ToListAsync();
        }

        public async Task<List<ReadingMaterial>> GetRecommendations(Guid PupilId)
        {
            // Step 1: Get completed sessions and include ReadingMaterial + genres
            var completedSessions = await _dataContext.ReadingSession
                .Include(rs => rs.ReadingMaterial)
                    .ThenInclude(rm => rm.ReadingMaterialGenres)
                .Where(rs => rs.PupilId == PupilId && rs.CompletionPercentage >= 80)
                .ToListAsync();

            if (!completedSessions.Any())
            {
                return await _dataContext.ReadingMaterial
                    .OrderByDescending(m => m.CreatedAt)
                    .Take(10)
                    .Include(m => m.ReadingMaterialGenres)
                        .ThenInclude(rmg => rmg.Genre)
                    .ToListAsync();
            }

            // Step 2: Extract completed materials
            var completedMaterials = completedSessions.Select(rs => rs.ReadingMaterial).ToList();
            var completedMaterialIds = completedMaterials.Select(c => c.Id).ToList();
            var avgDifficulty = completedMaterials.Average(c => c.Difficulty);
            var gradeLevel = completedMaterials
                .GroupBy(c => c.Grade_Level)
                .OrderByDescending(g => g.Count())
                .First().Key;

            var favoriteGenreIds = completedMaterials
                .SelectMany(c => c.ReadingMaterialGenres.Select(g => g.GenreId))
                .GroupBy(g => g)
                .OrderByDescending(g => g.Count())
                .Take(3)
                .Select(g => g.Key)
                .ToList();

            // Step 3: Recommend similar materials
            var recommended = await _dataContext.ReadingMaterial
                .Include(m => m.ReadingMaterialGenres)
                    .ThenInclude(rmg => rmg.Genre)
                .Where(m => !completedMaterialIds.Contains(m.Id))
                .Where(m => m.Grade_Level == gradeLevel)
                .Where(m => Math.Abs(m.Difficulty - avgDifficulty) <= 10)
                //.Where(m => m.ReadingMaterialGenres.Any(g => favoriteGenreIds.Contains(g.GenreId)))
                .Take(10)
                .ToListAsync();

            return recommended;
        }


        public async Task<ReadingMaterial?> GetByIdAsync(Guid id)
        {
            var readingMat = await _dataContext.ReadingMaterial.FirstOrDefaultAsync(r => r.Id == id);
            return readingMat;
        }
    }
}
