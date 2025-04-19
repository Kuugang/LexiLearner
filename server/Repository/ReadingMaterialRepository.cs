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

    public async Task<ReadingMaterial?> GetByIdAsync(Guid id)
    {
      var readingMat = await _dataContext.ReadingMaterial.FirstOrDefaultAsync(r => r.Id == id);
      return readingMat;
    }
  }
}
