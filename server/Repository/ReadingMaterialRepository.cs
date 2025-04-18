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
      var query = _dataContext.ReadingMaterial.AsQueryable();

      if (filters.Id != null)
      {
        query = query.Where(r => r.Id == filters.Id);
      }

      if (!string.IsNullOrEmpty(filters.Title))
      {
        query = query.Where(r => r.Title.ToLower().Contains(filters.Title.ToLower()));
      }

      if (!string.IsNullOrEmpty(filters.Genre))
      {
        var genre = await _genreService.GetGenreByName(filters.Genre);
        if (genre != null)
        {
          query = query.Where(r => r.Genre == genre);
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
