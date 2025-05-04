using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using Microsoft.EntityFrameworkCore;

namespace LexiLearner.Repository{
    public class ClassroomEnrollmentRepository : IClassroomEnrollmentRepository
    {
        private readonly DataContext _context;
        public ClassroomEnrollmentRepository(DataContext context) {
            _context = context;
        }

        public async Task<List<Classroom>> GetByPupilId(Guid PupilId)
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