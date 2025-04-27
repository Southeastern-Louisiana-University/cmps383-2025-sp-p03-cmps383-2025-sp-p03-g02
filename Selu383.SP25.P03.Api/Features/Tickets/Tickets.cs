using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Selu383.SP25.P03.Api.Features.Showtimes;
using Selu383.SP25.P03.Api.Features.Users; 
using Selu383.SP25.P03.Api.Features.Seats; 

namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ShowtimeId { get; set; }
        public Showtime Showtime { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        public int SeatId { get; set; }
        public Seat Seat { get; set; }

        [Required]
        public string PaymentMethod { get; set; } 
    }
}
