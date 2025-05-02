using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LexiLearner.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueJoinCodeToClassroom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "JoinCode",
                table: "Classroom",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Classroom_JoinCode",
                table: "Classroom",
                column: "JoinCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Classroom_JoinCode",
                table: "Classroom");

            migrationBuilder.DropColumn(
                name: "JoinCode",
                table: "Classroom");
        }
    }
}
