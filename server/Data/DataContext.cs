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

        public DbSet<Pupil> Pupil { get; set; }
        public DbSet<Teacher> Teacher { get; set; }
        public DbSet<Genre> Genre { get; set; }
        public DbSet<ReadingContent> ReadingContent { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Pupil and User one-to-one
            modelBuilder.Entity<Pupil>()
                .HasOne(p => p.User)
                .WithOne(u => u.Pupil)
                .HasForeignKey<Pupil>(p => p.UserId)
                .IsRequired();

            // Teacher and User one-to-one
            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.User)
                .WithOne(u => u.Teacher)
                .HasForeignKey<Teacher>(t => t.UserId)
                .IsRequired();

            // ReadingContent has 1 genre
            modelBuilder.Entity<ReadingContent>()
                .HasOne(rc => rc.Genre)
                .WithMany(g => g.ReadingContents)  // Now Genre has a collection of ReadingContents
                .HasForeignKey(rc => rc.GenreId)
                .IsRequired();


        }
    }
}
