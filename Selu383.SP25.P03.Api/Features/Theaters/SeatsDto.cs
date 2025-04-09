using System;

namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class SeatDto
    {
        public int Id { get; set; }

        public int ShowtimeId { get; set; }

        public string SeatNumber { get; set; }

        public bool IsBooked { get; set; }
    }
}
