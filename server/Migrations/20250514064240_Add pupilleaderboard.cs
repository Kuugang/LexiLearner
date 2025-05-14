using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LexiLearner.Migrations
{
    /// <inheritdoc />
    public partial class Addpupilleaderboard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PupilLeaderboard",
                columns: table => new
                {
                    PupilId = table.Column<Guid>(type: "uuid", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PupilLeaderboard", x => new { x.PupilId, x.Level });
                    table.ForeignKey(
                        name: "FK_PupilLeaderboard_Pupil_PupilId",
                        column: x => x.PupilId,
                        principalTable: "Pupil",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PupilLeaderboard");
        }
    }
}
