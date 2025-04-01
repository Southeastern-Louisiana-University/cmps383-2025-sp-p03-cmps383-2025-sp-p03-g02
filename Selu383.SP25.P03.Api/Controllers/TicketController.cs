using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Tickets;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly DbSet<Ticket> tickets;
        private readonly DataContext dataContext;

        public TicketController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            tickets = dataContext.Set<Ticket>();
        }

        [HttpGet]
        public IQueryable<TicketDto> GetAllTickets()
        {
            return GetTicketDtos(tickets);
        }

        [HttpGet("{id}")]
        public ActionResult<TicketDto> GetTicketById(int id)
        {
            var result = GetTicketDtos(tickets.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public ActionResult<TicketDto> CreateTicket(TicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var ticket = new Ticket
            {
                ShowtimeId = dto.ShowtimeId,
                UserId = dto.UserId,
                SeatNumber = dto.SeatNumber,
                TicketPrice = dto.TicketPrice,
                PurchaseDate = dto.PurchaseDate,
                TheaterId = dto.TheaterId
            };
            tickets.Add(ticket);
            dataContext.SaveChanges();

            dto.Id = ticket.Id;
            return CreatedAtAction(nameof(GetTicketById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        [Authorize]
        public ActionResult<TicketDto> UpdateTicket(int id, TicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var ticket = tickets.FirstOrDefault(x => x.Id == id);
            if (ticket == null)
            {
                return NotFound();
            }

            ticket.ShowtimeId = dto.ShowtimeId;
            ticket.UserId = dto.UserId;
            ticket.SeatNumber = dto.SeatNumber;
            ticket.TicketPrice = dto.TicketPrice;
            ticket.PurchaseDate = dto.PurchaseDate;
            ticket.TheaterId = dto.TheaterId;

            dataContext.SaveChanges();
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteTicket(int id)
        {
            var ticket = tickets.FirstOrDefault(x => x.Id == id);
            if (ticket == null)
            {
                return NotFound();
            }

            tickets.Remove(ticket);
            dataContext.SaveChanges();
            return Ok();
        }

        private bool IsInvalid(TicketDto dto)
        {
            return dto.ShowtimeId <= 0 ||
                   dto.UserId <= 0 ||
                   dto.SeatNumber <= 0 ||
                   dto.TicketPrice <= 0 ||
                   dto.PurchaseDate == default ||
                   dto.TheaterId <= 0;
        }

        private static IQueryable<TicketDto> GetTicketDtos(IQueryable<Ticket> tickets)
        {
            return tickets
                .Select(x => new TicketDto
                {
                    Id = x.Id,
                    ShowtimeId = x.ShowtimeId,
                    UserId = x.UserId,
                    SeatNumber = x.SeatNumber,
                    TicketPrice = x.TicketPrice,
                    PurchaseDate = x.PurchaseDate,
                    TheaterId = x.TheaterId
                });
        }
    }
}
