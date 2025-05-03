using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces{
    public interface IClassroomEnrollmentService{
        Task<Classroom> JoinClassroom(string JoinCode, ClaimsPrincipal User);
        Task LeaveClassroom(Guid ClassroomId, ClaimsPrincipal User);
        Task<List<Classroom>> GetByPupilId(ClaimsPrincipal User);
    }
}