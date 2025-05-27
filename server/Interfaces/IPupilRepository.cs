using System.Security.Claims;
using LexiLearner.Models;

namespace LexiLearner.Interfaces
{
  public interface IPupilRepository
  {
    Task<Pupil?> GetPupilByIdAsync(Guid Id);
    Task<Pupil?> GetPupilByUserIdAsync(string UserId);
    Task<LoginStreak?> GetLoginStreak(Guid PupilId);
    Task<LoginStreak> CreateLoginStreak(LoginStreak Streak);
    Task Update<T>(T entity) where T : class;
    Task<List<PupilLeaderboard>> GetPupilLeaderboardByPupilId(Guid PupilId);
    Task<List<PupilLeaderboard>> GetGlobal10Leaderboard();
    Task<PupilLeaderboard> CreatePupilLeaderboardEntry(PupilLeaderboard PupilLeaderboard);

  }
}
