using Dms.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Dms.Infrastructure.Persistence
{
    public static class DbInitializer
    {
        public static async Task SeedDataAsync(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<int>> roleManager)
        {
            // Đảm bảo Database đã được tạo hoặc được migrate
            await context.Database.MigrateAsync();

            // Khởi tạo các Role mặc định
            string[] roleNames = { "Admin", "User" };
            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(roleName));
                }
            }

            // Gán Permissions cho Role Admin
            var adminRole = await roleManager.FindByNameAsync("Admin");
            if (adminRole != null)
            {
                var existingClaims = await roleManager.GetClaimsAsync(adminRole);
                var allPermissions = Dms.Application.Common.Permissions.GetAllPermissions();

                foreach (var permission in allPermissions)
                {
                    if (!existingClaims.Any(c => c.Type == "permission" && c.Value == permission))
                    {
                        await roleManager.AddClaimAsync(adminRole, new System.Security.Claims.Claim("permission", permission));
                    }
                }
            }

            // Gán Permissions mặc định cho Role User (Chỉ xem)
            var userRole = await roleManager.FindByNameAsync("User");
            if (userRole != null)
            {
                var existingUserClaims = await roleManager.GetClaimsAsync(userRole);
                var userPermissions = new List<string>
                {
                    Dms.Application.Common.Permissions.Categories.View
                };

                foreach (var permission in userPermissions)
                {
                    if (!existingUserClaims.Any(c => c.Type == "permission" && c.Value == permission))
                    {
                        await roleManager.AddClaimAsync(userRole, new System.Security.Claims.Claim("permission", permission));
                    }
                }
            }

            // Khởi tạo tài khoản Admin mặc định
            var adminUsername = "admin";
            var adminEmail = "admin@dienlanhdms.com";
            
            var adminUser = await userManager.FindByNameAsync(adminUsername);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminUsername,
                    Email = adminEmail,
                    FullName = "Quản trị viên",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };

                // Mật khẩu mặc định: Admin@123
                var createPowerUser = await userManager.CreateAsync(adminUser, "Admin@123");
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}
