using MediatR;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.Objects.Queries;
using RealEstateAgency.Application.Interfaces;

namespace RealEstateAgency.Application.Features.Objects.Handlers;

public class GetListingHandler(IRealEstateService realEstateService) 
    : IRequestHandler<GetListingQuery, PagedResultDto<RealEstateCardDto>>
{
    public async Task<PagedResultDto<RealEstateCardDto>> Handle(GetListingQuery request, CancellationToken cancellationToken)
    {
        return await realEstateService.GetListingAsync(request, cancellationToken);
    }
}