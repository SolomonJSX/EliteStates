using MediatR;
using RealEstateAgency.Application.DTOs;

namespace RealEstateAgency.Application.Features.Lookups.Queries;

public record GetLookupsQuery : IRequest<AllLookupsDto>;