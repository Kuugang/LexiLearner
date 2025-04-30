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

    public async Task<Pupil?> GetPupilByIdAsync(Guid id)
    {
      return await _dataContext.Pupil.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Pupil?> GetPupilByUserIdAsync(string userId)
    {
      return await _dataContext.Pupil.FirstOrDefaultAsync(p => p.UserId == userId);
    }
  }
}
