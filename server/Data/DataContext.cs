using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using LexiLearner.Models;

namespace LexiLearner.Data
{
    public class DataContext : IdentityDbContext<User>
    //should use custom Identity User
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options) { }

        public DbSet <Pupil> Pupil {get; set; }
        public DbSet <Teacher> Teacher {get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.Entity<User>()
            // .if ang user kay role niya is Customer naa syay Customer Profile butngan related name nga Profile
            // .if ang user kay role niya is Owner naa syay Owner Profile butngan related name nga Profile
            //
            //
        }
    }
}
