using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces{
    public interface IClassroomService{
        Task<Classroom> GetById(Guid Id);
        Task<Classroom> GetByIdWithTeacherId(Guid Id);
        Task<Classroom> Create(ClassroomDTO.CreateClassroom request, ClaimsPrincipal User);
        Task Update(Classroom classroom);
        Task Delete(Classroom classroom);
    }
}