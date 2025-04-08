using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Selu383.SP25.P03.Api.Features.Showtimes;

namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class Seat
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ShowtimeId { get; set; }
        public Showtime Showtime { get; set; }

        [Required]
        [StringLength(5)]  // Seat number (e.g., A1, B2, etc.)
        public string SeatNumber { get; set; }

        [Required]
        public bool IsBooked { get; set; }
    }
}
