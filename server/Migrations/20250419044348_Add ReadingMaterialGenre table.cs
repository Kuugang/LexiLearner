using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LexiLearner.Migrations
{
    /// <inheritdoc />
    public partial class AddReadingMaterialGenretable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReadingMaterial_Genre_GenreId",
                table: "ReadingMaterial");

            migrationBuilder.DropIndex(
                name: "IX_ReadingMaterial_GenreId",
                table: "ReadingMaterial");

            migrationBuilder.DropColumn(
                name: "GenreId",
                table: "ReadingMaterial");

            migrationBuilder.CreateTable(
                name: "ReadingMaterialGenre",
                columns: table => new
                {
                    ReadingMaterialId = table.Column<Guid>(type: "uuid", nullable: false),
                    GenreId = table.Column<Guid>(type: "uuid", nullable: false),
                    Id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingMaterialGenre", x => new { x.ReadingMaterialId, x.GenreId });
                    table.ForeignKey(
                        name: "FK_ReadingMaterialGenre_Genre_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genre",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadingMaterialGenre_ReadingMaterial_ReadingMaterialId",
                        column: x => x.ReadingMaterialId,
                        principalTable: "ReadingMaterial",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReadingMaterialGenre_GenreId",
                table: "ReadingMaterialGenre",
                column: "GenreId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReadingMaterialGenre");

            migrationBuilder.AddColumn<Guid>(
                name: "GenreId",
                table: "ReadingMaterial",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_ReadingMaterial_GenreId",
                table: "ReadingMaterial",
                column: "GenreId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReadingMaterial_Genre_GenreId",
                table: "ReadingMaterial",
                column: "GenreId",
                principalTable: "Genre",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
