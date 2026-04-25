using MediatR;

namespace RealEstateAgency.Application.Features.Objects.Commands;

public record UpdateObjectCommand(
    int Id,
    int PropertyTypeId,
    int DistrictId,
    string Street,
    string HouseNumber,
    int? ApartmentNumber,
    decimal Price,
    double Area,
    string Description
) : IRequest<bool>;