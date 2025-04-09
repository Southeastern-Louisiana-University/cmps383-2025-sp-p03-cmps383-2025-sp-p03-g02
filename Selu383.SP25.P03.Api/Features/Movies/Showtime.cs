using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Showtimes
{
    public class Showtime
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MovieId { get; set; }
        public Movie Movie { get; set; }

        [Required]
        public DateTime ShowtimeDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public decimal TicketPrice { get; set; }

        [Required]
        public int TheaterId { get; set; }
        public Theater Theater { get; set; }
    }
}
