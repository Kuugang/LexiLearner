using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces{
    public interface IClassroomService{
        Task<Classroom> GetByClassroomId(Guid ClassroomId);
        Task<List<ClassroomDTO>> GetClassroomsByTeacherId(ClaimsPrincipal User);
		Task<List<ClassroomDTO>> GetClassroomsByPupilId(ClaimsPrincipal User);
        Task<List<Pupil>> GetPupilsByClassroomId(Guid ClassroomId, ClaimsPrincipal User);
        Task<ClassroomDTO> Create(ClassroomDTO.CreateClassroom Request, ClaimsPrincipal User);
        Task<ClassroomDTO> Update(Guid ClassroomId, ClassroomDTO.UpdateClassroom Request, ClaimsPrincipal User);
        Task Delete(Guid ClassroomId, ClaimsPrincipal User);
		Task<ClassroomDTO> JoinClassroom(string JoinCode, ClaimsPrincipal User);
		Task LeaveClassroom(Guid ClassroomId, ClaimsPrincipal User);
        Task<ClassroomEnrollmentDTO> AddPupil(Guid PupilId, Guid ClassroomId, ClaimsPrincipal User);
        Task RemovePupil(Guid PupilId, Guid ClassroomId, ClaimsPrincipal User);
        Task<ClassroomEnrollment> GetClassroomEnrollmentByPupilAndClassId(Guid PupilId, Guid ClassroomId);
        Task<List<ClassroomEnrollmentDTO.Leaderboard>> GetLeaderboard(Guid ClassroomId, ClaimsPrincipal User);
		
	}
}