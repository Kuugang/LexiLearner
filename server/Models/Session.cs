using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
  public class Session
  {
    public Guid Id { get; set; } = new Guid();
    public required string UserId { get; set; }
    [ForeignKey("UserId")]
    public required User User {get; set; }
    public int? Duration { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime EndAt { get; set; }
  }
}