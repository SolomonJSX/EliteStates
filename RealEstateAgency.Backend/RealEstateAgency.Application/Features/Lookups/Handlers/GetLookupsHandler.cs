using MediatR;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.Lookups.Queries;
using RealEstateAgency.Application.Interfaces;

namespace RealEstateAgency.Application.Features.Lookups.Handlers;

public class GetLookupsHandler(ILookupsService lookupsService) : IRequestHandler<GetLookupsQuery, AllLookupsDto>
{
    public async Task<AllLookupsDto> Handle(GetLookupsQuery request, CancellationToken cancellationToken)
    {
        return await lookupsService.GetAllLookupsAsync(cancellationToken);
    }
}