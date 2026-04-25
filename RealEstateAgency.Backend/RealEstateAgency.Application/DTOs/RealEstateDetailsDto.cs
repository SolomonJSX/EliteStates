namespace RealEstateAgency.Application.DTOs;

public record RealEstateDetailsDto(
    int Id,
    string PropertyTypeName,
    string DistrictName,
    string Street,
    string HouseNumber,
    int? ApartmentNumber,
    decimal Price,
    double Area,
    string Description,
    string Status,
    List<string> Photos, // Все фото объекта
    string OwnerName,
    string OwnerPhone
);