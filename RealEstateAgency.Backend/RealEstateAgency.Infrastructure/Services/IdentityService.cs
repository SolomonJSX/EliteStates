using Microsoft.AspNetCore.Identity;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Infrastructure.Services;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<(string? Email, string? AvatarUrl, string? Role)> GetUserInfoAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return (null, null, null);

        var roles = await _userManager.GetRolesAsync(user);
        return (user.Email, user.AvatarUrl, roles.FirstOrDefault());
    }

    public async Task<bool> UpdateAvatarAsync(string userId, string avatarUrl)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        user.AvatarUrl = avatarUrl;
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }
}