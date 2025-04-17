using LexiLearner.Interfaces;
using LexiLearner.Models;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace LexiLearner.Services
{
  public class GenreService : IGenreService
  {
    IGenreRepository _genreRepository;
    public GenreService(IGenreRepository genreRepository){
      _genreRepository = genreRepository;
    }

    public async Task<Genre> GetGenreByName(string name)
    {
      var g = await _genreRepository.GetGenreByName(name);
      
      if (g == null)
      {
        g = await _genreRepository.Create(new Genre{ Name = name});
      }
      
      return g;
    }

    public async Task<Guid?> GetGenreId(string genre)
    {
      var g = await _genreRepository.GetGenreByName(genre);
      
      if (g == null)
      {
        g = await _genreRepository.Create(new Genre{ Name = genre});
      }
      
      return g.Id;
    }

    Task<Guid> IGenreService.GetGenreId(string genre)
    {
      throw new NotImplementedException();
    }
  }
}