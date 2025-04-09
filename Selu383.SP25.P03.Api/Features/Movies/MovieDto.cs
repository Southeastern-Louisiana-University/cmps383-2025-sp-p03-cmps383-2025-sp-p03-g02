namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MovieDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public string Category { get; set; } = string.Empty; 
    }
}
