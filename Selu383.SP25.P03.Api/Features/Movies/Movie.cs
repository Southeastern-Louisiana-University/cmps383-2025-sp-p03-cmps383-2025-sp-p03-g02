using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class Movie
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public string Category { get; set; }
    }
}
