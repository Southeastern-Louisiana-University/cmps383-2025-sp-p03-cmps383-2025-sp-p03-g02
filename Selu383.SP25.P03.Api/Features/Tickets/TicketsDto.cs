using System;

namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class TicketDto
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public int UserId { get; set; }
        public int SeatNumber { get; set; }
        public decimal TicketPrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int TheaterId { get; set; }
    }
}
