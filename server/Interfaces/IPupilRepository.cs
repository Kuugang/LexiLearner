using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IPupilRepository
  {
    Task<Pupil?> GetPupilByIdAsync(Guid id);
    Task<Pupil?> GetPupilByUserIdAsync(string userId);
  }
}
