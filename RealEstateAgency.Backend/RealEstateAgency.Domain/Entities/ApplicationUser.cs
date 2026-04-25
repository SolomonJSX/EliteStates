using Microsoft.AspNetCore.Identity;

namespace RealEstateAgency.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}