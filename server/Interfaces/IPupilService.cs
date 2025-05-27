using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
  public interface IPupilService
  { 
    Task<Pupil?> GetPupilById(Guid PupilId);
    Task<Pupil?> GetPupilByUserId(string UserId);
    Task<LoginStreak?> GetLoginStreak(ClaimsPrincipal User);
    Task<LoginStreak> RecordLoginAsync(string UserId);
    Task<List<PupilLeaderboard>> GetPupilLeaderboard(ClaimsPrincipal User);
    Task<List<PupilLeaderboard>> GetPupilLeaderboardByPupilId(Guid PupilId);
    Task<List<PupilLeaderboard>> GetGlobal10Leaderboard();
    Task<PupilLeaderboard> CreatePupilLeaderboardEntry(PupilLeaderboardDTO.Create request);
  }
}
