using MediatR;
using RealEstateAgency.Application.DTOs;

namespace RealEstateAgency.Application.Features.Objects.Queries;

public record GetListingQuery(
    int PageNumber = 1, 
    int PageSize = 12,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    int? DistrictId = null,
    int? PropertyTypeId = null // Добавили это
) : IRequest<PagedResultDto<RealEstateCardDto>>;