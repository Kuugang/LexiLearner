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
            // throw new NotImplementedException();
            await _context.Classroom.AddAsync(classroom);
            await _context.SaveChangesAsync();
        }
        public async Task<Classroom> GetById(Guid Id)
        {
            return await _context.Classroom.FindAsync(Id);
        }

        public async Task<List<Classroom>> GetByTeacherId(Guid Id)
        {
            return await _context.Classroom.Where(c => c.TeacherId == Id).ToListAsync();
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

    }
}