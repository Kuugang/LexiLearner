using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
  public class LoginStreak
  {
    public Guid Id { get; set; } = new Guid();
    public required Guid PupilId { get; set; }
    [ForeignKey("PupilId")]
    public required Pupil Pupil { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime LastLoginDate { get; set; }
  }
}