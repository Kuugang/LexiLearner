using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using Microsoft.EntityFrameworkCore;

namespace LexiLearner.Repository
{
  public class GenreRepository : IGenreRepository
  {
    private readonly DataContext _dbContext;
    public GenreRepository(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task<Genre> Create(Genre genre)
    {
      await _dbContext.AddAsync(genre);
      await _dbContext.SaveChangesAsync();
      return genre;
    }

    public async Task<Genre> GetGenreByName(string genre)
    {
      var g = await _dbContext.Genre.FirstOrDefaultAsync(g => g.Name == genre);
      return g;
    }

    public async Task<List<Genre>> GetGenres(List<string> genreNames)
    {
      var genres = await _dbContext.Genre.Where(g => genreNames.Contains(g.Name)).ToListAsync();
      return genres;
    }
  }
}