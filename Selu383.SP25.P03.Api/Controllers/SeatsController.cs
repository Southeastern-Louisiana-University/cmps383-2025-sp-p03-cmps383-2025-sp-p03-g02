using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/seats")]
    [ApiController]
    public class SeatsController : ControllerBase
    {
        private readonly DataContext _context;

        public SeatsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/seats
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeatDto>>> GetSeats()
        {
            var seats = await _context.Seats
                .Select(s => new SeatDto
                {
                    Id = s.Id,
                    ShowtimeId = s.ShowtimeId,
                    SeatNumber = s.SeatNumber,
                    IsBooked = s.IsBooked
                })
                .ToListAsync();

            return seats;
        }

        // GET: api/seats/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SeatDto>> GetSeatById(int id)
        {
            var seat = await _context.Seats
                .Where(s => s.Id == id)
                .Select(s => new SeatDto
                {
                    Id = s.Id,
                    ShowtimeId = s.ShowtimeId,
                    SeatNumber = s.SeatNumber,
                    IsBooked = s.IsBooked
                })
                .FirstOrDefaultAsync();

            if (seat == null)
            {
                return NotFound();
            }

            return seat;
        }

        // POST: api/seats
        [HttpPost]
        public async Task<ActionResult<SeatDto>> CreateSeat(SeatDto dto)
        {
            if (dto.SeatNumber == null || dto.SeatNumber.Trim().Length == 0)
            {
                return BadRequest("Seat number is required.");
            }

            var seat = new Seat
            {
                ShowtimeId = dto.ShowtimeId,
                SeatNumber = dto.SeatNumber,
                IsBooked = dto.IsBooked
            };

            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();

            dto.Id = seat.Id;

            return CreatedAtAction(nameof(GetSeatById), new { id = dto.Id }, dto);
        }

        // PUT: api/seats/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<SeatDto>> UpdateSeat(int id, SeatDto dto)
        {
            if (dto.SeatNumber == null || dto.SeatNumber.Trim().Length == 0)
            {
                return BadRequest("Seat number is required.");
            }

            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }

            seat.ShowtimeId = dto.ShowtimeId;
            seat.SeatNumber = dto.SeatNumber;
            seat.IsBooked = dto.IsBooked;

            await _context.SaveChangesAsync();

            return Ok(dto);
        }

        // DELETE: api/seats/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
