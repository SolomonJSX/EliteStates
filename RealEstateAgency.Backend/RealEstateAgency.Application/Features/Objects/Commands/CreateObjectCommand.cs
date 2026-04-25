using MediatR;

namespace RealEstateAgency.Application.Features.Objects.Commands;

public record CreateObjectCommand(
    int PropertyTypeId,
    int DistrictId,
    int? OwnerId, // Может быть null, если создает сам клиент
    string Street,
    string HouseNumber,
    int? ApartmentNumber,
    decimal Price,
    double Area,
    string Description
) : IRequest<int>;