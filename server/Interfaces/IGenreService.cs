using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IGenreService
  {
    Task<Genre> GetGenreByName(String name);
    Task<Genre> Create(string genreName);
  }
}