using System.Security.Claims;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Interfaces
{
    public interface IReadingAssignmentService
    {
        Task<ReadingMaterialAssignmentDTO> CreateReadingAssignment(Guid ClassroomId, ReadingMaterialAssignmentDTO.Create Request, ClaimsPrincipal User);
        Task<ReadingMaterialAssignment> GetReadingAssignmentById(Guid Id);
        Task<List<ReadingMaterialAssignment>> GetAllReadingAssignmentsByClassroomId(Guid ClassroomId, ClaimsPrincipal User);
        Task<List<ReadingMaterialAssignment>> GetActiveReadingAssignmentsByClassroomId(Guid ClassroomId, ClaimsPrincipal User);
        Task<ReadingMaterialAssignment> UpdateReadingAssignment(Guid ReadingAssignmentId, ReadingMaterialAssignmentDTO.Update Request, ClaimsPrincipal User);
        Task DeleteReadingAssignment(Guid ReadingAssignmentId, ClaimsPrincipal User);
        Task<ReadingMaterialAssignmentDTO.Overview> GetReadingAssignmentStatByAssignmentId(Guid ReadingAssignmentId, ClaimsPrincipal User);
        Task<ReadingMaterialAssignmentDTO.Overview> GetReadingAssignmentStatByAssignment(ReadingMaterialAssignment ReadingAssignment);
        Task<List<ReadingMaterialAssignmentDTO.Overview>> GetReadingAssignmentStatByClassroomId(Guid ClassroomId, ClaimsPrincipal User);

        Task<ReadingAssignmentLogDTO> CreateAssignmentLog(Guid ReadingAssignmentId, Guid MinigameLogId);
		Task<ReadingAssignmentLog> GetAssignmentLogById(Guid ReadingAssignmentLogId);
        Task<List<ReadingAssignmentLog>> GetAssignmentLogByReadingAssignmentIdAndPupilId(Guid ReadingAssignmentId, Guid PupilId);
		Task<List<ReadingAssignmentLog>> GetAssignmentLogsByReadingAssignmentId(Guid ReadingAssignmentId, ClaimsPrincipal User);
		Task<List<ReadingAssignmentLog>> GetAssignmentLogsByPupilId(Guid PupilId);
        Task<List<ReadingAssignmentLog>> GetAssignmentLogsByClassroomId(Guid ClassroomId);
        Task<List<ReadingAssignmentLog>> GetAssignmentLogsByClassroomIdAndPupilId(Guid ClassroomId, Guid PupilId);
    }
}