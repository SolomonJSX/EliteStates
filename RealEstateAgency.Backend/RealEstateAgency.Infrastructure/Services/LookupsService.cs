using Microsoft.EntityFrameworkCore;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Infrastructure.Persistence;

namespace RealEstateAgency.Infrastructure.Services;

public class LookupsService(ApplicationDbContext context) : ILookupsService
{
    public async Task<AllLookupsDto> GetAllLookupsAsync(CancellationToken cancellationToken)
    {
        return new AllLookupsDto(
            await context.Districts
                .Select(d => new LookupItemDto(d.Id, d.Name))
                .ToListAsync(cancellationToken),
            await context.PropertyTypes
                .Select(p => new LookupItemDto(p.Id, p.Name))
                .ToListAsync(cancellationToken),
            await context.OperationTypes
                .Select(o => new LookupItemDto(o.Id, o.Name))
                .ToListAsync(cancellationToken)
        );
    }
}