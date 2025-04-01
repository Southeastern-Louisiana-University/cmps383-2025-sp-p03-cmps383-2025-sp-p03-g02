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
        private readonly DbSet<Showtime> showtimes;
        private readonly DataContext dataContext;

        public ShowtimeController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            showtimes = dataContext.Set<Showtime>();
        }

        [HttpGet]
        public IQueryable<ShowtimeDto> GetAllShowtimes()
        {
            return GetShowtimeDtos(showtimes);
        }

        [HttpGet("{id}")]
        public ActionResult<ShowtimeDto> GetShowtimeById(int id)
        {
            var result = GetShowtimeDtos(showtimes.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public ActionResult<ShowtimeDto> CreateShowtime(ShowtimeDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var showtime = new Showtime
            {
                MovieId = dto.MovieId,
                ShowtimeDate = dto.ShowtimeDate,
                TicketPrice = dto.TicketPrice,
                TheaterId = dto.TheaterId
            };
            showtimes.Add(showtime);
            dataContext.SaveChanges();

            dto.Id = showtime.Id;
            return CreatedAtAction(nameof(GetShowtimeById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        public ActionResult<ShowtimeDto> UpdateShowtime(int id, ShowtimeDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var showtime = showtimes.FirstOrDefault(x => x.Id == id);
            if (showtime == null)
            {
                return NotFound();
            }

            showtime.MovieId = dto.MovieId;
            showtime.ShowtimeDate = dto.ShowtimeDate;
            showtime.TicketPrice = dto.TicketPrice;
            showtime.TheaterId = dto.TheaterId;

            dataContext.SaveChanges();
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteShowtime(int id)
        {
            var showtime = showtimes.FirstOrDefault(x => x.Id == id);
            if (showtime == null)
            {
                return NotFound();
            }

            showtimes.Remove(showtime);
            dataContext.SaveChanges();
            return Ok();
        }

        private bool IsInvalid(ShowtimeDto dto)
        {
            return dto.MovieId <= 0 ||
                   dto.ShowtimeDate == default ||
                   dto.TicketPrice <= 0 ||
                   dto.TheaterId <= 0;
        }

        private static IQueryable<ShowtimeDto> GetShowtimeDtos(IQueryable<Showtime> showtimes)
        {
            return showtimes
                .Select(x => new ShowtimeDto
                {
                    Id = x.Id,
                    MovieId = x.MovieId,
                    ShowtimeDate = x.ShowtimeDate,
                    TicketPrice = x.TicketPrice,
                    TheaterId = x.TheaterId
                });
        }
    }
}
