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

        public async Task Create(Classroom classroom)
        {
            await _context.Classroom.AddAsync(classroom);
            await _context.SaveChangesAsync();
        }
        public async Task<Classroom?> GetById(Guid id)
        {
            return await _context.Classroom.FindAsync(id);
        }

        public async Task<List<Classroom>> GetByTeacherId(Guid teacherId)
        {
            return await _context.Classroom.Where(c => c.TeacherId == teacherId).ToListAsync();
        }

        public async Task Update(Classroom classroom)
        {
            _context.Classroom.Update(classroom);
            await _context.SaveChangesAsync();
        }
        public async Task Delete(Classroom classroom)
        {
            _context.Classroom.Remove(classroom);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DoesJoinCodeExist(string code)
        {
            return await _context.Classroom.AnyAsync(c => c.JoinCode == code);
        }

		public async Task<List<Classroom>> GetClassroomsByPupilId(Guid pupilId)
		{
            var query = _context.Classroom.Include(c => c.ClassroomEnrollments).AsQueryable();
            return await query.Where(c => c.ClassroomEnrollments.Any(ce => ce.PupilId == pupilId)).ToListAsync();
		}

		public async Task JoinClassroom(ClassroomEnrollment classroom)
		{
			await _context.ClassroomEnrollment.AddAsync(classroom);
			await _context.SaveChangesAsync();
		}

        public async Task LeaveClassroom(ClassroomEnrollment classroom)
        {
            _context.ClassroomEnrollment.Remove(classroom);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Pupil>> GetPupilsByClassroomId(Guid classroomId)
        {
            var classroom = await _context.Classroom
                .Include(c => c.ClassroomEnrollments)
                .ThenInclude(ce => ce.Pupil)
                .FirstOrDefaultAsync(c => c.Id == classroomId);

            return classroom?.ClassroomEnrollments.Select(ce => ce.Pupil).ToList() ?? [];
        }

        public async Task RemovePupil(ClassroomEnrollment classroomEnrollment)
        {
            _context.ClassroomEnrollment.Remove(classroomEnrollment);
            await _context.SaveChangesAsync();
        }

        public async Task<ClassroomEnrollment> AddPupil(ClassroomEnrollment classroomEnrollment)
        {
            await _context.ClassroomEnrollment.AddAsync(classroomEnrollment);
            await _context.SaveChangesAsync();
            return classroomEnrollment;
        }

        public async Task<ClassroomEnrollment?> GetClassroomEnrollmentByPupilandClassId(Guid pupilId, Guid classroomId)
        {
            return await _context.ClassroomEnrollment.FirstOrDefaultAsync(ce => ce.PupilId == pupilId && ce.ClassroomId == classroomId);
        }
    }
}