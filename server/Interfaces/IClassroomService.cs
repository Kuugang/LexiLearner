using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces{
    public interface IClassroomService{
        Task<Classroom> GetById(Guid Id);
        Task<List<Classroom>> GetByTeacherId(ClaimsPrincipal User);
        Task<Classroom> Create(ClassroomDTO.CreateClassroom request, ClaimsPrincipal User);
        Task<Classroom> Update(Guid ClassroomId, ClassroomDTO.UpdateClassroom request, ClaimsPrincipal User);
        Task Delete(Guid Id, ClaimsPrincipal User);
    }
}