using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LexiLearner.Migrations
{
    /// <inheritdoc />
    public partial class Updateloginstreak : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LoginStreak_AspNetUsers_UserId",
                table: "LoginStreak");

            migrationBuilder.DropIndex(
                name: "IX_LoginStreak_UserId",
                table: "LoginStreak");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "LoginStreak");

            migrationBuilder.AlterColumn<int>(
                name: "Level",
                table: "Pupil",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PupilId",
                table: "LoginStreak",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_LoginStreak_PupilId",
                table: "LoginStreak",
                column: "PupilId");

            migrationBuilder.AddForeignKey(
                name: "FK_LoginStreak_Pupil_PupilId",
                table: "LoginStreak",
                column: "PupilId",
                principalTable: "Pupil",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LoginStreak_Pupil_PupilId",
                table: "LoginStreak");

            migrationBuilder.DropIndex(
                name: "IX_LoginStreak_PupilId",
                table: "LoginStreak");

            migrationBuilder.DropColumn(
                name: "PupilId",
                table: "LoginStreak");

            migrationBuilder.AlterColumn<int>(
                name: "Level",
                table: "Pupil",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "LoginStreak",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_LoginStreak_UserId",
                table: "LoginStreak",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_LoginStreak_AspNetUsers_UserId",
                table: "LoginStreak",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
