﻿using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTheaters
    {
        public static void Initialize(IServiceProvider serviceProvider)
{
    using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
    {
        // Clear any existing theaters (to avoid duplicates)
        // Had to add that temp to remove old seeded data, editing this does nothing
       // context.Theaters.RemoveRange(context.Theaters);

        // Add new theater records
        context.Theaters.AddRange(
            new Theater
            {
                Name = "Lions Den New York",
                Address = "570 2nd Ave, New York, NY 10016",
                SeatCount = 150
            },
            new Theater
            {
                Name = "Lions Den New Orleans",
                Address = "636 N Broad St, New Orleans, LA 7011",
                SeatCount = 200
            },
            new Theater
            {
                Name = "Lions Den Los Angeles",
                Address = "4020 Marlton Ave, Los Angeles, CA 90008",
                SeatCount = 300
            }
        );
        context.SaveChanges();
    }
}

    }
}
