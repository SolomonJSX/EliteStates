namespace RealEstateAgency.Application.Interfaces;

public interface IIdentityService
{
    Task<(string? Email, string? AvatarUrl, string? Role)> GetUserInfoAsync(string userId);
    Task<bool> UpdateAvatarAsync(string userId, string avatarUrl);
}