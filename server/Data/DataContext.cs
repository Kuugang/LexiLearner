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
        public DbSet<ReadingMaterial> ReadingMaterial { get; set; }
        public DbSet<Classroom> Classroom { get; set; }
        public DbSet<ClassroomEnrollment> ClassroomEnrollment { get; set; }
        public DbSet<Achievement> Achievement { get; set; }
        public DbSet<PupilAchievement> PupilAchievement { get; set; }
        public DbSet<ReadingSession> ReadingSession { get; set; }
        public DbSet<Minigame> Minigame { get; set; }
        public DbSet<MinigameLog> MinigameLog { get; set; }

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
            modelBuilder.Entity<ReadingMaterial>()
                .HasOne(rc => rc.Genre)
                .WithMany()
                .HasForeignKey(rc => rc.GenreId)
                .IsRequired();

            modelBuilder.Entity<Classroom>()
                .HasOne(c => c.Teacher)
                .WithMany()
                .HasForeignKey(c => c.TeacherId);

            modelBuilder.Entity<ClassroomEnrollment>()
                .HasOne(ce => ce.Pupil)
                .WithMany()
                .HasForeignKey(ce => ce.PupilId);

            modelBuilder.Entity<ClassroomEnrollment>()
                .HasOne(ce => ce.Classroom)
                .WithMany()
                .HasForeignKey(ce => ce.ClassroomId);

            modelBuilder.Entity<PupilAchievement>()
                .HasOne(pa => pa.Pupil)
                .WithMany()
                .HasForeignKey(pa => pa.PupilId);

            modelBuilder.Entity<MinigameLog>()
                .HasOne(ml => ml.Minigame)
                .WithMany()
                .HasForeignKey(ml => ml.MinigameId);

            modelBuilder.Entity<MinigameLog>()
                .HasOne(ml => ml.Pupil)
                .WithMany()
                .HasForeignKey(ml => ml.PupilId);

            modelBuilder.Entity<ReadingSession>()
                .HasOne(rs => rs.Pupil)
                .WithMany()
                .HasForeignKey(rs => rs.PupilId);

            modelBuilder.Entity<ReadingSession>()
                .HasOne(rs => rs.ReadingMaterial)
                .WithMany()
                .HasForeignKey(rs => rs.ReadingMaterialId);
        }
    }
}
