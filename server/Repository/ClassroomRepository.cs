using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Data;

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
        public async Task<Classroom> GetById(Guid Id)
        {
            return await _context.Classroom.FindAsync(Id);
        }

        public async Task<List<Classroom>> GetByTeacherId(Guid TeacherId)
        {
            return await _context.Classroom.Where(c => c.TeacherId == TeacherId).ToListAsync();
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

		public async Task<List<Classroom>> GetClassroomsByPupilId(Guid PupilId)
		{
			var pupilClassrooms = await _context.ClassroomEnrollment
			.Where(c => c.PupilId == PupilId)
			.Select(c => c.ClassroomId)
			.ToListAsync();

			var classrooms = await _context.Classroom
			.Where(c => pupilClassrooms.Contains(c.Id))
			.ToListAsync();

			return classrooms;
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
	}
}