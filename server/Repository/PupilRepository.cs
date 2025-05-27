using System.Security.Claims;
using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using Microsoft.EntityFrameworkCore;

namespace LexiLearner.Repository
{
  public class PupilRepository : IPupilRepository
  {
    private readonly DataContext _dataContext;
    public PupilRepository(DataContext dataContext)
    {
      _dataContext = dataContext;
    }

    public async Task<Pupil?> GetPupilByIdAsync(Guid Id)
    {
      return await _dataContext.Pupil.FirstOrDefaultAsync(p => p.Id == Id);
    }

    public async Task<Pupil?> GetPupilByUserIdAsync(string UserId)
    {
      return await _dataContext.Pupil.FirstOrDefaultAsync(p => p.UserId == UserId);
    }
    
    public async Task<LoginStreak?> GetLoginStreak(Guid PupilId)
    {
      return await _dataContext.LoginStreak.AsNoTracking().FirstOrDefaultAsync(l => l.PupilId == PupilId);
    }


    public async Task<LoginStreak> CreateLoginStreak(LoginStreak Streak)
    {
        _dataContext.Attach(Streak.Pupil);
        await _dataContext.LoginStreak.AddAsync(Streak);
        await _dataContext.SaveChangesAsync();

        return Streak;
    }
    
    public async Task<List<PupilLeaderboard>> GetPupilLeaderboardByPupilId(Guid PupilId)
    {
        return await _dataContext.PupilLeaderboard
            .Where(pl => pl.PupilId == PupilId)
            .OrderByDescending(pl => pl.Level)
            .ToListAsync();
    }

    public async Task<PupilLeaderboard> CreatePupilLeaderboardEntry(PupilLeaderboard PupilLeaderboard)
    {
        _dataContext.Attach(PupilLeaderboard.Pupil);
        await _dataContext.PupilLeaderboard.AddAsync(PupilLeaderboard);
        await _dataContext.SaveChangesAsync();
        return PupilLeaderboard;
    }

    public async Task<List<PupilLeaderboard>> GetGlobal10Leaderboard()
    {
        var allLeaderboards = await _dataContext.PupilLeaderboard.AsNoTracking().ToListAsync();
        return allLeaderboards
            .GroupBy(pl => pl.PupilId)
            .Select(g => g.OrderByDescending(pl => pl.Level).First())
            .OrderByDescending(pl => pl.Level)
            .Take(10)
            .ToList();
    }
    
    public async Task Update<T>(T entity) where T : class
    {
        _dataContext.Set<T>().Update(entity);
        await _dataContext.SaveChangesAsync();
    }
  }
}
