using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Selu383.SP25.P03.Api.Features.Showtimes;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Theaters;

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
        public int SeatNumber { get; set; }

        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public decimal TicketPrice { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        [Required]
        public int TheaterId { get; set; }
        public Theater Theater { get; set; }
    }
}
