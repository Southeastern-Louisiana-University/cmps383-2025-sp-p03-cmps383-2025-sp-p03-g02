using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Tickets;
using Selu383.SP25.P03.Api.Features.Seats;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly DataContext _context;

        public TicketController(DataContext context)
        {
            _context = context;
        }

        // GET: api/tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetTickets()
        {
            var tickets = await _context.Tickets
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    ShowtimeId = t.ShowtimeId,
                    UserId = t.UserId,
                    SeatId = t.SeatId,
                    PaymentMethod = t.PaymentMethod
                })
                .ToListAsync();

            return Ok(tickets);
        }

        // GET: api/tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> GetTicketById(int id)
        {
            var ticket = await _context.Tickets
                .Where(t => t.Id == id)
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    ShowtimeId = t.ShowtimeId,
                    UserId = t.UserId,
                    SeatId = t.SeatId,
                    PaymentMethod = t.PaymentMethod
                })
                .FirstOrDefaultAsync();

            if (ticket == null)
            {
                return NotFound();
            }

            return ticket;
        }

        // POST: api/tickets
        [HttpPost]
        public async Task<ActionResult<TicketDto>> CreateTicket(TicketDto dto)
        {
            var seat = await _context.Seats.FindAsync(dto.SeatId);
            if (seat == null)
            {
                return NotFound("Seat not found");
            }

            // Check if the seat is already booked
            if (seat.IsBooked)
            {
                return BadRequest("Seat is already booked");
            }

            // Mark the seat as booked
            seat.IsBooked = true;
            _context.Seats.Update(seat);

           
            var ticket = new Ticket
            {
                ShowtimeId = dto.ShowtimeId,
                UserId = dto.UserId,
                SeatId = dto.SeatId,
                PaymentMethod = dto.PaymentMethod
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            
            dto.Id = ticket.Id;
            return CreatedAtAction(nameof(GetTicketById), new { id = dto.Id }, dto);
        }

        // PUT: api/tickets/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TicketDto>> UpdateTicket(int id, TicketDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            
            ticket.ShowtimeId = dto.ShowtimeId;
            ticket.UserId = dto.UserId;
            ticket.SeatId = dto.SeatId;
            ticket.PaymentMethod = dto.PaymentMethod;

            _context.Tickets.Update(ticket);

           
            var seat = await _context.Seats.FindAsync(ticket.SeatId);
            if (seat != null && !seat.IsBooked) //seat should be marked booked after a ticket is updated
            {
                seat.IsBooked = true;
                _context.Seats.Update(seat);
            }

            await _context.SaveChangesAsync();

            return Ok(dto);
        }

        // DELETE: api/tickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            // Unbook the seat
            var seat = await _context.Seats.FindAsync(ticket.SeatId);
            if (seat != null)
            {
                seat.IsBooked = false;
                _context.Seats.Update(seat);
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
