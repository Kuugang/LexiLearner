using System.Security.Claims;

using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
    public interface IReadingMaterialService
    {
        Task<ReadingMaterial> Create(ReadingMaterialDTO.Create request);
        Task<ReadingMaterial?> GetById(Guid id);
        Task<List<ReadingMaterial>> FilterReadingMaterials(ReadingMaterialDTO.Read filters);
        Task<List<ReadingMaterial>> GetRecommendations(ClaimsPrincipal token);
    }
}
