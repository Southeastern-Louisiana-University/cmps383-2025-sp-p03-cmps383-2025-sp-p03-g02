using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedUsers
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(
                serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

                // Seed Admin
                if (!await userManager.Users.AnyAsync(x => x.UserName == "galkadi"))
                {
                    var galkadi = new User 
                    { 
                        UserName = "galkadi",
                        SecurityStamp = Guid.NewGuid().ToString()
                    };
                    var createResult = await userManager.CreateAsync(galkadi, "Password123!");
                    
                    if (createResult.Succeeded)
                    {
                        await userManager.AddToRoleAsync(galkadi, "Admin");
                    }
                    else
                    {
                        Console.WriteLine($"Failed to create galkadi: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
                    }
                }

                // Seed Waitstaff
                if (!await userManager.Users.AnyAsync(x => x.UserName == "lions"))
                {
                    var lions = new User 
                    { 
                        UserName = "lions",
                        SecurityStamp = Guid.NewGuid().ToString()
                    };
                    var createResult = await userManager.CreateAsync(lions, "Password123!");
                    
                    if (createResult.Succeeded)
                    {
                        await userManager.AddToRoleAsync(lions, "WaitStaff");
                    }
                }

                // Seed Standard Users
                var standardUsers = new[]
                {
                    new { Username = "bob", Role = "User" },
                    new { Username = "sue", Role = "User" }
                };

                foreach (var user in standardUsers)
                {
                    if (!await userManager.Users.AnyAsync(x => x.UserName == user.Username))
                    {
                        var newUser = new User 
                        { 
                            UserName = user.Username,
                            SecurityStamp = Guid.NewGuid().ToString()
                        };
                        var createResult = await userManager.CreateAsync(newUser, "Password123!");
                        
                        if (createResult.Succeeded)
                        {
                            await userManager.AddToRoleAsync(newUser, user.Role);
                        }
                    }
                }
            }
        }
    }
}