using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Data;
using LexiLearner.Models.DTO;

namespace LexiLearner.Repository{
    public class ClassroomRepository : IClassroomRepository
    {
        private readonly DataContext _context;

        public ClassroomRepository(DataContext context) {
            _context = context;
        }

        public async Task Create(Classroom Classroom)
        {
            await _context.Classroom.AddAsync(Classroom);
            await _context.SaveChangesAsync();
        }
        public async Task<Classroom?> GetById(Guid Id)
        {
            return await _context.Classroom.FindAsync(Id);
        }

        public async Task<List<Classroom>> GetByTeacherId(Guid TeacherId)
        {
            return await _context.Classroom.Include(c => c.ClassroomEnrollments).Where(c => c.TeacherId == TeacherId).ToListAsync();
        }

        public async Task Update(Classroom Classroom)
        {
            _context.Classroom.Update(Classroom);
            await _context.SaveChangesAsync();
        }
        public async Task Delete(Classroom Classroom)
        {
            _context.Classroom.Remove(Classroom);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DoesJoinCodeExist(string Code)
        {
            return await _context.Classroom.AnyAsync(c => c.JoinCode == Code);
        }

		public async Task<List<Classroom>> GetClassroomsByPupilId(Guid PupilId)
		{
            var query = _context.Classroom.Include(c => c.ClassroomEnrollments).AsQueryable();
            return await query.Where(c => c.ClassroomEnrollments.Any(ce => ce.PupilId == PupilId)).ToListAsync();
		}

		public async Task JoinClassroom(ClassroomEnrollment Classroom)
		{
			await _context.ClassroomEnrollment.AddAsync(Classroom);
			await _context.SaveChangesAsync();
		}

        public async Task LeaveClassroom(ClassroomEnrollment Classroom)
        {
            _context.ClassroomEnrollment.Remove(Classroom);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Pupil>> GetPupilsByClassroomId(Guid ClassroomId)
        {
            var classroom = await _context.Classroom
                .Include(c => c.ClassroomEnrollments)
                .ThenInclude(ce => ce.Pupil)
                .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(c => c.Id == ClassroomId);

            return classroom?.ClassroomEnrollments.Select(ce => ce.Pupil).ToList() ?? [];
        }

        public async Task RemovePupil(ClassroomEnrollment ClassroomEnrollment)
        {
            _context.ClassroomEnrollment.Remove(ClassroomEnrollment);
            await _context.SaveChangesAsync();
        }

        public async Task<ClassroomEnrollment> AddPupil(ClassroomEnrollment ClassroomEnrollment)
        {
            await _context.ClassroomEnrollment.AddAsync(ClassroomEnrollment);
            await _context.SaveChangesAsync();
            return ClassroomEnrollment;
        }

        public async Task<ClassroomEnrollment?> GetClassroomEnrollmentByPupilandClassId(Guid PupilId, Guid ClassroomId)
        {
            return await _context.ClassroomEnrollment.FirstOrDefaultAsync(ce => ce.PupilId == PupilId && ce.ClassroomId == ClassroomId);
        }

        public async Task<ReadingMaterialAssignment> CreateReadingAssignment(ReadingMaterialAssignment ReadingMaterialAssignment)
        {
            await _context.ReadingMaterialAssignment.AddAsync(ReadingMaterialAssignment);
            await _context.SaveChangesAsync();
            return ReadingMaterialAssignment;
        }

        public Task<ReadingMaterialAssignment?> GetReadingAssignmentById(Guid Id)
        {
            return _context.ReadingMaterialAssignment.Include(rma => rma.ReadingMaterial).Include(rma => rma.Minigame).Include(rma => rma.ReadingAssignmentLogs).FirstOrDefaultAsync(r => r.Id == Id);
        }

        public Task<List<ReadingMaterialAssignment>> GetAllReadingAssignmentsByClassroomId(Guid ClassroomId)
        {
            return _context.ReadingMaterialAssignment.Include(rma => rma.ReadingMaterial).Include(rma => rma.Minigame).Where(r => r.ClassroomId == ClassroomId).ToListAsync();
        }

        public Task<List<ReadingMaterialAssignment>> GetActiveReadingAssignmentsByClassroomId(Guid ClassroomId)
        {
            return _context.ReadingMaterialAssignment.Include(rma => rma.ReadingMaterial).Include(rma => rma.Minigame).Where(r => r.ClassroomId == ClassroomId && r.IsActive).ToListAsync();
        }

        public Task<ReadingMaterialAssignment> UpdateReadingAssignment(ReadingMaterialAssignment ReadingMaterialAssignment)
        {
            _context.ReadingMaterialAssignment.Update(ReadingMaterialAssignment);
            return _context.SaveChangesAsync().ContinueWith(_ => ReadingMaterialAssignment);
        }
        
        public Task DeleteReadingAssignment(ReadingMaterialAssignment ReadingMaterialAssignment)
        {
            _context.ReadingMaterialAssignment.Remove(ReadingMaterialAssignment);
            return _context.SaveChangesAsync();
        }

        public async Task<List<ClassroomEnrollment>> GetLeaderboard(Guid ClassroomId)
        {
            return await _context.ClassroomEnrollment
                .Include(ce => ce.Pupil)
                .ThenInclude(p => p.User)
                .Where(ce => ce.ClassroomId == ClassroomId)
                .OrderByDescending(ce => ce.Pupil.Level)
                .ToListAsync();
        }

        public async Task<ReadingAssignmentLog> CreateAssignmentLog(ReadingAssignmentLog AssignmentLog)
        {
            await _context.ReadingAssignmentLog.AddAsync(AssignmentLog);
            await _context.SaveChangesAsync();
            return AssignmentLog;
        }

        public async Task<ReadingAssignmentLog?> GetAssignmentLogById(Guid ReadingAssignmentLogId)
        {
            return await _context.ReadingAssignmentLog.Include(ra => ra.MinigameLog).FirstOrDefaultAsync(ra => ra.Id == ReadingAssignmentLogId);
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByReadingAssignmentId(Guid ReadingAssignmentId)
        {
            return await _context.ReadingAssignmentLog.Include(ra => ra.MinigameLog).Where(ra => ra.ReadingMaterialAssignmentId == ReadingAssignmentId).OrderBy(ra => ra.MinigameLog.PupilId).ThenByDescending(ra => ra.CompletedAt).ToListAsync();
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByPupilId(Guid PupilId)
        {
            return await _context.ReadingAssignmentLog.Include(ra => ra.MinigameLog).Where(ra => ra.MinigameLog.PupilId == PupilId).ToListAsync();
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByClassroomId(Guid ClassroomId)
        {
            return await _context.ReadingAssignmentLog
                .Include(ra => ra.MinigameLog)
                .Include(ra => ra.ReadingMaterialAssignment)
                .Where(ra => ra.ReadingMaterialAssignment.ClassroomId == ClassroomId)
                .ToListAsync();
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByClassroomIdAndPupilId(Guid ClassroomId, Guid PupilId)
        {
            return await _context.ReadingAssignmentLog
                .Include(ra => ra.MinigameLog)
                .Include(ra => ra.ReadingMaterialAssignment)
                .Where(ra => ra.ReadingMaterialAssignment.ClassroomId == ClassroomId && ra.MinigameLog.PupilId == PupilId)
                .ToListAsync();
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogByReadingAssignmentIdAndPupilId(Guid ReadingAssignmentId, Guid PupilId)
        {
            return await _context.ReadingAssignmentLog.Include(ra => ra.MinigameLog).Where(ra => ra.ReadingMaterialAssignmentId == ReadingAssignmentId && ra.MinigameLog.PupilId == PupilId).OrderByDescending(ra => ra.CompletedAt).ToListAsync();
        }
    }
}