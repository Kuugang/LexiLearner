using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
    public class ReadingMaterialGenre
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ReadingMaterialId { get; set; }
        [ForeignKey("ReadingMaterialId")]
        public ReadingMaterial? ReadingMaterial { get; set; }
        public required Guid GenreId { get; set; }
        [ForeignKey("GenreId")]
        public Genre? Genre { get; set; }
    }
}
