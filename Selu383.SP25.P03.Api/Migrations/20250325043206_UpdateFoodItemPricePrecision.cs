using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFoodItemPricePrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodItems",
                table: "FoodItems");

            migrationBuilder.RenameTable(
                name: "FoodItems",
                newName: "FoodItem");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodItem",
                table: "FoodItem",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodItem",
                table: "FoodItem");

            migrationBuilder.RenameTable(
                name: "FoodItem",
                newName: "FoodItems");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodItems",
                table: "FoodItems",
                column: "Id");
        }
    }
}
