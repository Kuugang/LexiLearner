using LexiLearner.Models;
using LexiLearner.Models.DTO;
namespace LexiLearner.Interfaces{
    public interface IClassroomRepository{
        Task<Classroom?> GetById(Guid id);
        Task<List<Classroom>> GetByTeacherId(Guid id);
        Task<bool> DoesJoinCodeExist(string code);
        Task Create(Classroom classroom);
        Task Update(Classroom classroom);
        Task Delete(Classroom classroom);
		Task JoinClassroom(ClassroomEnrollment classroom);
		Task LeaveClassroom(ClassroomEnrollment classroom);
		Task<List<Classroom>> GetClassroomsByPupilId(Guid pupilId);
		Task<List<Pupil>> GetPupilsByClassroomId(Guid classroomId);
		Task<ClassroomEnrollment> AddPupil(ClassroomEnrollment classroomEnrollment);
		Task RemovePupil(ClassroomEnrollment classroomEnrollment);
		Task<ClassroomEnrollment?> GetClassroomEnrollmentByPupilandClassId(Guid pupilId, Guid classroomId);
	}
}