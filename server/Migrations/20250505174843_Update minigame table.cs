using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LexiLearner.Migrations
{
    /// <inheritdoc />
    public partial class Updateminigametable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxScore",
                table: "Minigame",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxScore",
                table: "Minigame");
        }
    }
}
