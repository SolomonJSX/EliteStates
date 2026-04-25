namespace RealEstateAgency.Application.DTOs;

public record RealEstateCardDto(
    int Id,
    string Title, // Сформируем как "Тип в районе"
    decimal Price,
    double Area,
    string DistrictName,
    string? MainPhotoUrl,
    string Status
);