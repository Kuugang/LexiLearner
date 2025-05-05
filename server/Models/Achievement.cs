using System.ComponentModel.DataAnnotations;
namespace LexiLearner.Models
{

    public class Achievement
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [StringLength(100)]
        public required String Name { get; set; }

        [StringLength(255)]
        public required String Description { get; set; }

        //Stores url/directory path for Badge Image
        [StringLength(255)]
        public required String Badge { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
    }
}
