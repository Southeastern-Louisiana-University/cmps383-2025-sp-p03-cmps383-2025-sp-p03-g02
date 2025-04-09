using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Showtimes;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/showtimes")]
    [ApiController]
    public class ShowtimeController : ControllerBase
    {
        private readonly DataContext _context;

        public ShowtimeController(DataContext context)
        {
            _context = context;
        }

        // GET: api/showtimes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShowtimeDto>>> GetShowtimes()
        {
            var showtimes = await _context.Showtimes
                .Select(x => new ShowtimeDto
                {
                    Id = x.Id,
                    MovieId = x.MovieId,
                    ShowtimeDate = x.ShowtimeDate,
                    TicketPrice = x.TicketPrice,
                    TheaterId = x.TheaterId
                })
                .ToListAsync();

            return showtimes;
        }

        // GET: api/showtimes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShowtimeDto>> GetShowtimeById(int id)
        {
            var showtime = await _context.Showtimes
                .Where(x => x.Id == id)
                .Select(x => new ShowtimeDto
                {
                    Id = x.Id,
                    MovieId = x.MovieId,
                    ShowtimeDate = x.ShowtimeDate,
                    TicketPrice = x.TicketPrice,
                    TheaterId = x.TheaterId
                })
                .FirstOrDefaultAsync();

            if (showtime == null)
            {
                return NotFound();
            }

            return showtime;
        }

        // POST: api/showtimes
        [HttpPost]
        public async Task<ActionResult<ShowtimeDto>> CreateShowtime(ShowtimeDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest("Invalid input data");
            }

            var showtime = new Showtime
            {
                MovieId = dto.MovieId,
                ShowtimeDate = dto.ShowtimeDate,
                TicketPrice = dto.TicketPrice,
                TheaterId = dto.TheaterId
            };

            _context.Showtimes.Add(showtime);
            await _context.SaveChangesAsync();

            dto.Id = showtime.Id;

            return CreatedAtAction(nameof(GetShowtimeById), new { id = dto.Id }, dto);
        }

        // PUT: api/showtimes/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ShowtimeDto>> UpdateShowtime(int id, ShowtimeDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest("Invalid input data");
            }

            var showtime = await _context.Showtimes.FindAsync(id);
            if (showtime == null)
            {
                return NotFound();
            }

            showtime.MovieId = dto.MovieId;
            showtime.ShowtimeDate = dto.ShowtimeDate;
            showtime.TicketPrice = dto.TicketPrice;
            showtime.TheaterId = dto.TheaterId;

            await _context.SaveChangesAsync();

            return Ok(dto);
        }

        // DELETE: api/showtimes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShowtime(int id)
        {
            var showtime = await _context.Showtimes.FindAsync(id);
            if (showtime == null)
            {
                return NotFound();
            }

            _context.Showtimes.Remove(showtime);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IsInvalid(ShowtimeDto dto)
        {
            return dto.MovieId <= 0 || 
                   dto.ShowtimeDate == default || 
                   dto.TicketPrice <= 0 || 
                   dto.TheaterId <= 0;
        }
    }
}
