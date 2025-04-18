using LexiLearner.Exceptions;
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

    public async Task<Genre> Create(string genreName)
    {
      //var genre = new Genre { Name = genreName };
      var genre = await GetGenreByName(genreName);

      if (genre != null)
      {
        throw new ApplicationExceptionBase(
            "Genre already exists",
            "Creating genre failed.",
            StatusCodes.Status409Conflict
          );
      }

      genre = new Genre { Name = genreName };
      return await _genreRepository.Create(genre);
    }

    public async Task<Genre> GetGenreByName(string name)
    {
      var g = await _genreRepository.GetGenreByName(name);    
      return g;
    }

  }
}