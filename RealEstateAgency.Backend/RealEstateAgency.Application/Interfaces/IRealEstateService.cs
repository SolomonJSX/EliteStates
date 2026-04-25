using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.Objects.Queries;

namespace RealEstateAgency.Application.Interfaces;

public interface IRealEstateService
{
    Task<PagedResultDto<RealEstateCardDto>> GetListingAsync(GetListingQuery request, CancellationToken cancellationToken);
    Task<RealEstateDetailsDto?> GetDetailsByIdAsync(int id, CancellationToken ct);
}