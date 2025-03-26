using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.FoodItem;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedFoodMenu
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                if (context.FoodItem.Any())
                {
                    return;   // DB has been seeded
                }
                context.FoodItem.AddRange(
                    new FoodItem
                    {
						Name = "Popcorn",
						Description = "Large Popcorn Bucket 130oz",
						Price = 7,
						ImageUrl = "https://383g02p03theaterlionsden.neocities.org/food/320x480-popcorn_PNG25.png"
						
                    }
                );
                context.SaveChanges();
            }
        }
    }
}







