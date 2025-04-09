using System;

namespace Selu383.SP25.P03.Api.Features.Showtimes
{
    public class ShowtimeDto
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public DateTime ShowtimeDate { get; set; }
        public decimal TicketPrice { get; set; }
        public int TheaterId { get; set; }
    }
}
