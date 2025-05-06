using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces{
    public interface IClassroomService{
        Task<ClassroomDTO> GetById(Guid ClassroomId);
        Task<List<ClassroomDTO>> GetByTeacherId(ClaimsPrincipal User);
        Task<ClassroomDTO> Create(ClassroomDTO.CreateClassroom request, ClaimsPrincipal User);
        Task<ClassroomDTO> Update(Guid ClassroomId, ClassroomDTO.UpdateClassroom request, ClaimsPrincipal User);
        Task Delete(Guid ClassroomId, ClaimsPrincipal User);
		Task<ClassroomDTO> JoinClassroom(string JoinCode, ClaimsPrincipal User);
		Task LeaveClassroom(Guid ClassroomId, ClaimsPrincipal User);
		Task<List<ClassroomDTO>> GetClassroomsByPupilId(ClaimsPrincipal User);
	}
}