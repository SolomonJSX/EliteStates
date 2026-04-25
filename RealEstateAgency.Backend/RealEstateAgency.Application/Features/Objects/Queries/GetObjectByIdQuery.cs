using MediatR;
using RealEstateAgency.Application.DTOs;

namespace RealEstateAgency.Application.Features.Objects.Queries;

public record GetObjectByIdQuery(int Id) : IRequest<RealEstateDetailsDto>;