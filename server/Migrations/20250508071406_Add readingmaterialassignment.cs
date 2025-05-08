using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LexiLearner.Migrations
{
    /// <inheritdoc />
    public partial class Addreadingmaterialassignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ClassroomEnrollment",
                table: "ClassroomEnrollment");

            migrationBuilder.DropIndex(
                name: "IX_ClassroomEnrollment_ClassroomId",
                table: "ClassroomEnrollment");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClassroomEnrollment",
                table: "ClassroomEnrollment",
                columns: new[] { "ClassroomId", "PupilId" });

            migrationBuilder.CreateTable(
                name: "ReadingMaterialAssignment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassroomId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReadingMaterialId = table.Column<Guid>(type: "uuid", nullable: false),
                    MinigameId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingMaterialAssignment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingMaterialAssignment_Classroom_ClassroomId",
                        column: x => x.ClassroomId,
                        principalTable: "Classroom",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadingMaterialAssignment_Minigame_MinigameId",
                        column: x => x.MinigameId,
                        principalTable: "Minigame",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadingMaterialAssignment_ReadingMaterial_ReadingMaterialId",
                        column: x => x.ReadingMaterialId,
                        principalTable: "ReadingMaterial",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReadingMaterialAssignment_ClassroomId",
                table: "ReadingMaterialAssignment",
                column: "ClassroomId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingMaterialAssignment_MinigameId",
                table: "ReadingMaterialAssignment",
                column: "MinigameId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingMaterialAssignment_ReadingMaterialId",
                table: "ReadingMaterialAssignment",
                column: "ReadingMaterialId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReadingMaterialAssignment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ClassroomEnrollment",
                table: "ClassroomEnrollment");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClassroomEnrollment",
                table: "ClassroomEnrollment",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ClassroomEnrollment_ClassroomId",
                table: "ClassroomEnrollment",
                column: "ClassroomId");
        }
    }
}
