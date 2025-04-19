using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IGenreRepository
  {
    Task<Genre> GetGenreByName(string genre);
    Task<Genre> Create(Genre genre);
    Task<List<Genre>> GetGenres(List<string> genreNames);
  }
}