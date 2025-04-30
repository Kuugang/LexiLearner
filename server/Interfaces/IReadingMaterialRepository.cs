using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
    public interface IReadingMaterialRepository
    {
      Task<ReadingMaterial> Create(ReadingMaterial readingMaterial);
      Task<ReadingMaterial?> GetByIdAsync(Guid id);
      Task<List<ReadingMaterial>> FilterReadingMaterial(ReadingMaterialDTO.Read filters);
    }
}
