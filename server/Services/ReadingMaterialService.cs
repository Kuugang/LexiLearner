using System.Net.Mime;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using MimeKit.Cryptography;

namespace LexiLearner.Services
{
  public class ReadingMaterialService : IReadingMaterialService
  {
    private readonly IReadingMaterialRepository _readingMaterialRepository;
    private readonly IGenreService _genreService;
    private readonly IReadabilityService _readabilityService;
    private readonly IFileUploadService _fileUploadService;
   
    public ReadingMaterialService(IReadingMaterialRepository readingMaterialRepository, IGenreService genreService, IReadabilityService readabilityService, IFileUploadService fileUploadService)
    {
      _readingMaterialRepository = readingMaterialRepository;
      _genreService = genreService;
      _readabilityService = readabilityService;
      _fileUploadService = fileUploadService;
    }
    
    public async Task<ReadingMaterial> Create(ReadingMaterialDTO.Create request)
    {
      var genre = await _genreService.GetGenreByName(request.Genre);
      
      var readingMaterial = new ReadingMaterial
      {
        GenreId = genre.Id,
        Genre = genre,
        Author = request.Author,
        Title = request.Title,
        Description = request.Description,
        Cover = request.Cover,
        Content = request.Content,
        Difficulty = (float)_readabilityService.CalculateFleschScore(request.Content),
        IsDepEd = request.IsDepEd
      };
      
      return await _readingMaterialRepository.Create(readingMaterial);
    }
    

    public Task<List<ReadingMaterial>> FilterReadingMaterials(ReadingMaterialDTO.Read read)
    {
      throw new NotImplementedException();
    }

    public Task<ReadingMaterial?> GetById(Guid id)
    {
      throw new NotImplementedException();
    }
  }
}