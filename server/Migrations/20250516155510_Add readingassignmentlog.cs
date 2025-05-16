using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LexiLearner.Migrations
{
    /// <inheritdoc />
    public partial class Addreadingassignmentlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReadingAssignmentLog",
                columns: table => new
                {
                    ReadingAssignmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    MinigameLogId = table.Column<Guid>(type: "uuid", nullable: false),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReadingMaterialAssignmentId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingAssignmentLog", x => new { x.ReadingAssignmentId, x.MinigameLogId });
                    table.ForeignKey(
                        name: "FK_ReadingAssignmentLog_MinigameLog_MinigameLogId",
                        column: x => x.MinigameLogId,
                        principalTable: "MinigameLog",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadingAssignmentLog_ReadingMaterialAssignment_ReadingAssig~",
                        column: x => x.ReadingAssignmentId,
                        principalTable: "ReadingMaterialAssignment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadingAssignmentLog_ReadingMaterialAssignment_ReadingMater~",
                        column: x => x.ReadingMaterialAssignmentId,
                        principalTable: "ReadingMaterialAssignment",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReadingAssignmentLog_MinigameLogId",
                table: "ReadingAssignmentLog",
                column: "MinigameLogId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReadingAssignmentLog_ReadingMaterialAssignmentId",
                table: "ReadingAssignmentLog",
                column: "ReadingMaterialAssignmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReadingAssignmentLog");
        }
    }
}
