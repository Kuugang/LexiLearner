using LexiLearner.Models;
namespace LexiLearner.Interfaces{
    public interface IClassroomEnrollmentRepository{
        Task JoinClassroom(ClassroomEnrollment classroom);
        Task LeaveClassroom(ClassroomEnrollment classroom);
        Task <List<Classroom>> GetByPupilId(Guid PupilId);
    }
}