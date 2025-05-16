using LexiLearner.Models;
namespace LexiLearner.Interfaces{
    public interface IClassroomRepository{
        Task<Classroom?> GetById(Guid Id);
        Task<List<Classroom>> GetByTeacherId(Guid Id);
        Task<bool> DoesJoinCodeExist(string Code);
        Task Create(Classroom Classroom);
        Task Update(Classroom Classroom);
        Task Delete(Classroom Classroom);
		Task JoinClassroom(ClassroomEnrollment Classroom);
		Task LeaveClassroom(ClassroomEnrollment Classroom);
		Task<List<Classroom>> GetClassroomsByPupilId(Guid PupilId);
		Task<List<Pupil>> GetPupilsByClassroomId(Guid ClassroomId);
		Task<ClassroomEnrollment> AddPupil(ClassroomEnrollment ClassroomEnrollment);
		Task RemovePupil(ClassroomEnrollment ClassroomEnrollment);
		Task<ClassroomEnrollment?> GetClassroomEnrollmentByPupilandClassId(Guid PupilId, Guid ClassroomId);
		Task<ReadingMaterialAssignment> CreateReadingAssignment(ReadingMaterialAssignment ReadingMaterialAssignment);
		Task<ReadingMaterialAssignment?> GetReadingAssignmentById(Guid Id);
		Task<List<ReadingMaterialAssignment>> GetAllReadingAssignmentsByClassroomId(Guid ClassroomId);
		Task<List<ReadingMaterialAssignment>> GetActiveReadingAssignmentsByClassroomId(Guid ClassroomId);
		Task<ReadingMaterialAssignment> UpdateReadingAssignment(ReadingMaterialAssignment ReadingMaterialAssignment);
		Task DeleteReadingAssignment(ReadingMaterialAssignment ReadingMaterialAssignment);
		Task<List<ClassroomEnrollment>> GetLeaderboard(Guid ClassroomId);
		Task<ReadingAssignmentLog> CreateAssignmentLog(ReadingAssignmentLog AssignmentLog);
		Task<ReadingAssignmentLog?> GetAssignmentLogById(Guid ReadingAssignmentLogId);
		Task<List<ReadingAssignmentLog>> GetAssignmentLogsByReadingAssignmentId(Guid ReadingAssignmentId);
		Task<List<ReadingAssignmentLog>> GetAssignmentLogsByPupilId(Guid PupilId);
        Task<List<ReadingAssignmentLog>> GetAssignmentLogsByClassroomId(Guid ClassroomId);
        Task<List<ReadingAssignmentLog>> GetAssignmentLogsByClassroomIdAndPupilId(Guid ClassroomId, Guid PupilId);
        Task<ReadingAssignmentLog?> GetAssignmentLogByReadingAssignmentIdAndPupilId(Guid ReadingAssignmentId, Guid PupilId);
	}
}