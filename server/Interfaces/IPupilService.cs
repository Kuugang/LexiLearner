using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IPupilService
  {
    Task<Pupil?> GetPupilById(Guid id);
    Task<Pupil?> GetPupilByUserId(string userId);
  }
}
