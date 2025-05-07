using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces{
    public interface IClassroomService{
        Task<ClassroomDTO> GetByClassroomId(Guid classroomId);
        Task<List<ClassroomDTO>> GetClassroomsByTeacherId(ClaimsPrincipal User);
		Task<List<ClassroomDTO>> GetClassroomsByPupilId(ClaimsPrincipal User);
        Task<List<Pupil>> GetPupilsByClassroomId(Guid classroomId);
        Task<ClassroomDTO> Create(ClassroomDTO.CreateClassroom request, ClaimsPrincipal User);
        Task<ClassroomDTO> Update(Guid classroomId, ClassroomDTO.UpdateClassroom request, ClaimsPrincipal user);
        Task Delete(Guid classroomId, ClaimsPrincipal user);
		Task<ClassroomDTO> JoinClassroom(string joinCode, ClaimsPrincipal user);
		Task LeaveClassroom(Guid classroomId, ClaimsPrincipal user);
        Task<ClassroomEnrollmentDTO> AddPupil(Guid pupilId, Guid classroomId, ClaimsPrincipal user);
        Task RemovePupil(Guid pupilId, Guid classroomId, ClaimsPrincipal user);
        Task<ClassroomEnrollment> GetClassroomEnrollmentByPupilAndClassId(Guid pupilId, Guid classroomId);

	}
}