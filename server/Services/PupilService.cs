using System.Security.Claims;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Services
{
  public class PupilService : IPupilService
  {
    private readonly IPupilRepository _pupilRepository;
    public PupilService(IPupilRepository pupilRepository)
    {
      _pupilRepository = pupilRepository;
    }

    public async Task<Pupil?> GetPupilById(Guid id)
    {
      return await _pupilRepository.GetPupilByIdAsync(id);
    }

    public async Task<Pupil?> GetPupilByUserId(string userId)
    {
      return await _pupilRepository.GetPupilByUserIdAsync(userId);
    }
  }
}
