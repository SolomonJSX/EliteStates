using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstateAgency.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Newdata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RealEstatePhoto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsMain = table.Column<bool>(type: "bit", nullable: false),
                    RealEstateObjectId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RealEstatePhoto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RealEstatePhoto_RealEstateObjects_RealEstateObjectId",
                        column: x => x.RealEstateObjectId,
                        principalTable: "RealEstateObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RealEstatePhoto_RealEstateObjectId",
                table: "RealEstatePhoto",
                column: "RealEstateObjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RealEstatePhoto");
        }
    }
}
