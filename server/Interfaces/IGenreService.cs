using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IGenreService
  {
    Task<Genre> GetGenreByName(string name);
    Task<Genre> Create(string genreName);
    Task<List<Genre>> GetGenres (List<string> genreNames);
  }
}