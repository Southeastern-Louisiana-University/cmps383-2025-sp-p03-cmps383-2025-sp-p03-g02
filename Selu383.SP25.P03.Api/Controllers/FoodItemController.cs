using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.FoodItem;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Features.FoodItem.Controllers
{
    [Route("api/fooditem")]
    [ApiController]
    public class FoodItemController : ControllerBase
    {
        private readonly DataContext _context;

        public FoodItemController(DataContext context)
        {
            _context = context;
        }

        // GET: api/FoodItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodItemDto>>> GetFoodItems()
        {
            return await _context.FoodItem
                .Select(f => new FoodItemDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Description = f.Description,
                    Price = f.Price,
                    ImageUrl = f.ImageUrl,
                    Category = f.Category
                })
                .ToListAsync();
        }


        // GET: api/FoodItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FoodItemDto>> GetFoodItem(int id)
        {
            var foodItem = await _context.FoodItem.FindAsync(id);

            if (foodItem == null)
            {
                return NotFound();
            }

            return new FoodItemDto
            {
                Id = foodItem.Id,
                Name = foodItem.Name,
                Description = foodItem.Description,
                Price = foodItem.Price,
                ImageUrl = foodItem.ImageUrl,
                Category = foodItem.Category
            };
        }


        // POST: api/FoodItem
        [HttpPost]
        public async Task<ActionResult<FoodItemDto>> PostFoodItem(FoodItemDto foodItemDto)
        {
            var foodItem = new FoodItem
            {
                Name = foodItemDto.Name,
                Description = foodItemDto.Description,
                Price = foodItemDto.Price,
                ImageUrl = foodItemDto.ImageUrl,
                Category = foodItemDto.Category
            };

            _context.FoodItem.Add(foodItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFoodItem", new { id = foodItem.Id }, foodItemDto);
        }


        // PUT: api/FoodItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFoodItem(int id, FoodItemDto foodItemDto)
        {
            if (id != foodItemDto.Id)
            {
                return BadRequest();
            }

            var foodItem = await _context.FoodItem.FindAsync(id);
            if (foodItem == null)
            {
                return NotFound();
            }

            foodItem.Name = foodItemDto.Name;
            foodItem.Description = foodItemDto.Description;
            foodItem.Price = foodItemDto.Price;
            foodItem.ImageUrl = foodItemDto.ImageUrl;
            foodItem.Category = foodItemDto.Category;

            _context.Entry(foodItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/FoodItem/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFoodItem(int id)
        {
            var foodItem = await _context.FoodItem.FindAsync(id);
            if (foodItem == null)
            {
                return NotFound();
            }

            _context.FoodItem.Remove(foodItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
