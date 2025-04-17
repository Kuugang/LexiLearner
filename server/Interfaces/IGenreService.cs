using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IGenreService
  {
    Task<Guid> GetGenreId(String genre);
    Task<Genre> GetGenreByName(String name);
  }
}