namespace RealEstateAgency.Application.DTOs;

public record UserProfileDto(
    string Id,
    string Email,
    string? AvatarUrl,
    string FirstName,
    string LastName,
    string? MiddleName,
    string? Phone,
    string? Role,
    // Дополнительные поля для клиента
    string? City,
    string? Street,
    string? House
);