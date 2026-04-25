using MediatR;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.Objects.Queries;
using RealEstateAgency.Application.Interfaces;

namespace RealEstateAgency.Application.Features.Objects.Handlers;

public class GetObjectByIdHandler(IRealEstateService realEstateService) : IRequestHandler<GetObjectByIdQuery, RealEstateDetailsDto>
{
    public async Task<RealEstateDetailsDto?> Handle(GetObjectByIdQuery request, CancellationToken cancellationToken)
    {
        return await realEstateService.GetDetailsByIdAsync(request.Id, cancellationToken);
    }
}