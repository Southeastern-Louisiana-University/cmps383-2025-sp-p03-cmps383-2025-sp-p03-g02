using System;

namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class TicketDto
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public int UserId { get; set; }
        public int SeatId { get; set; }
        public string PaymentMethod { get; set; }
    }
}
