using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Data;

namespace LexiLearner.Repository{
    public class ClassroomRepository : IClassroomRepository
    {
        private readonly DataContext _context;

        public ClassroomRepository(DataContext contenxt) {
            _context = contenxt;
        }
        public async Task Create(Classroom classroom)
        {
            // throw new NotImplementedException();
            await _context.Classroom.AddAsync(classroom);
            await _context.SaveChangesAsync();
        }

        public Task Delete(Classroom classroom)
        {
            throw new NotImplementedException();
        }

        public Task<Classroom?> GetById(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task<Classroom?> GetByIdWithTeacherId(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task Update(Classroom classroom)
        {
            throw new NotImplementedException();
        }
    }
}