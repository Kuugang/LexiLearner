using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IGenreRepository
  {
    Task<Genre?> GetGenreByName(String genre);
    Task<Genre> Create(Genre genre);
  }
}