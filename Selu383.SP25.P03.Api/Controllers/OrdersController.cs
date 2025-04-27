using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.FoodItem;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly DataContext _context;

        public OrderController(DataContext context)
        {
            _context = context;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _context.Orders
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    SeatId = o.SeatId,
                    FoodItemId = o.FoodItemId,
                    Quantity = o.Quantity,
                    PaymentMethod = o.PaymentMethod,
                    TotalPrice = o.TotalPrice,
                    Status = o.Status
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Where(o => o.Id == id)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    SeatId = o.SeatId,
                    FoodItemId = o.FoodItemId,
                    Quantity = o.Quantity,
                    PaymentMethod = o.PaymentMethod,
                    TotalPrice = o.TotalPrice,
                    Status = o.Status
                })
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder(OrderDto dto)
        {
            var seat = await _context.Seats.FindAsync(dto.SeatId);
            if (seat == null)
            {
                return NotFound("Seat not found");
            }

            var foodItem = await _context.FoodItems.FindAsync(dto.FoodItemId);
            if (foodItem == null)
            {
                return NotFound("Food item not found");
            }

            var totalPrice = foodItem.Price * dto.Quantity;

            var order = new Order
            {
                UserId = dto.UserId,
                SeatId = dto.SeatId,
                FoodItemId = dto.FoodItemId,
                Quantity = dto.Quantity,
                PaymentMethod = dto.PaymentMethod,
                TotalPrice = totalPrice,
                Status = "Pending"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            dto.Id = order.Id;
            dto.TotalPrice = totalPrice;
            dto.Status = order.Status;
            
            return CreatedAtAction(nameof(GetOrderById), new { id = dto.Id }, dto);
        }

        // PUT: api/orders/5
        [HttpPut("{id}")]
        public async Task<ActionResult<OrderDto>> UpdateOrder(int id, OrderDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.PaymentMethod = dto.PaymentMethod;
            order.Status = dto.Status;

            if (order.FoodItemId != dto.FoodItemId || order.Quantity != dto.Quantity)
            {
                var foodItem = await _context.FoodItems.FindAsync(dto.FoodItemId);
                if (foodItem == null)
                {
                    return NotFound("Food item not found");
                }
                order.FoodItemId = dto.FoodItemId;
                order.Quantity = dto.Quantity;
                order.TotalPrice = foodItem.Price * dto.Quantity;
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            dto.TotalPrice = order.TotalPrice;
            return Ok(dto);
        }

        // DELETE: api/orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}