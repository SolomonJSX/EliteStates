using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstateAgency.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddObjectPhotoEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RealEstatePhoto_RealEstateObjects_RealEstateObjectId",
                table: "RealEstatePhoto");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RealEstatePhoto",
                table: "RealEstatePhoto");

            migrationBuilder.RenameTable(
                name: "RealEstatePhoto",
                newName: "RealEstatePhotos");

            migrationBuilder.RenameIndex(
                name: "IX_RealEstatePhoto_RealEstateObjectId",
                table: "RealEstatePhotos",
                newName: "IX_RealEstatePhotos_RealEstateObjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RealEstatePhotos",
                table: "RealEstatePhotos",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RealEstatePhotos_RealEstateObjects_RealEstateObjectId",
                table: "RealEstatePhotos",
                column: "RealEstateObjectId",
                principalTable: "RealEstateObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RealEstatePhotos_RealEstateObjects_RealEstateObjectId",
                table: "RealEstatePhotos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RealEstatePhotos",
                table: "RealEstatePhotos");

            migrationBuilder.RenameTable(
                name: "RealEstatePhotos",
                newName: "RealEstatePhoto");

            migrationBuilder.RenameIndex(
                name: "IX_RealEstatePhotos_RealEstateObjectId",
                table: "RealEstatePhoto",
                newName: "IX_RealEstatePhoto_RealEstateObjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RealEstatePhoto",
                table: "RealEstatePhoto",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RealEstatePhoto_RealEstateObjects_RealEstateObjectId",
                table: "RealEstatePhoto",
                column: "RealEstateObjectId",
                principalTable: "RealEstateObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
