using MediatR;
using RealEstateAgency.Application.DTOs;

namespace RealEstateAgency.Application.Features.Objects.Queries;

public record GetObjectsByStreetQuery(string StreetName) : IRequest<IEnumerable<RealEstateObjectDto>>;