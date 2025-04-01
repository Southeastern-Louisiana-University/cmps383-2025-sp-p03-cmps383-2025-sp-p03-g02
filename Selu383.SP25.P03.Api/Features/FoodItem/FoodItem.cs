using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.FoodItem
{
    public class FoodItem
    {
        public int Id { get; set; } 

        [MaxLength(120)]
        public required string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, 1000)]
        public decimal Price { get; set; }

        public string? ImageUrl { get; set; } 

        [Required]
        public string Category { get; set; } = string.Empty; 
    }
}
