using System.Diagnostics;
using System.Net.Mime;
using LexiLearner.Exceptions;
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
      var genres = await _genreService.GetGenres(request.Genres);
      var missingGenres = request.Genres.Except(genres.Select(g => g.Name)).ToList();
      if (missingGenres.Any())
      {
        throw new ApplicationExceptionBase("Genres are not registered in database.", $"Genres not found: {string.Join(", ", missingGenres)}", StatusCodes.Status400BadRequest);
      }
      
      var readingMaterial = new ReadingMaterial
      {
        Author = request.Author,
        Title = request.Title,
        Description = request.Description,
        Cover = request.Cover,
        Content = request.Content,
        Difficulty = (float)_readabilityService.CalculateFleschScore(request.Content),
        IsDepEd = request.IsDepEd,
        ReadingMaterialGenres = genres.Select(g => new ReadingMaterialGenre
        {
          GenreId = g.Id
        }).ToList()
      };
      
      return await _readingMaterialRepository.Create(readingMaterial);
    }
    

    public async Task<List<ReadingMaterial>> FilterReadingMaterials(ReadingMaterialDTO.Read filters)
    {
      var readingMats = await _readingMaterialRepository.FilterReadingMaterial(filters);
      return readingMats;
    }

    public async Task<ReadingMaterial?> GetById(Guid id)
    {
      var readingMat = await _readingMaterialRepository.GetByIdAsync(id);
      return readingMat;
    }
  }
}