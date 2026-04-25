using RealEstateAgency.Application.DTOs;

namespace RealEstateAgency.Application.Interfaces;

public interface ILookupsService
{
    Task<AllLookupsDto> GetAllLookupsAsync(CancellationToken cancellationToken);
}