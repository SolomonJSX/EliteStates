using Microsoft.EntityFrameworkCore;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.Objects.Queries;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Infrastructure.Persistence;

namespace RealEstateAgency.Infrastructure.Services;

public class RealEstateService(ApplicationDbContext context) : IRealEstateService
{
    public async Task<PagedResultDto<RealEstateCardDto>> GetListingAsync(GetListingQuery request, CancellationToken cancellationToken)
    {
        var query = context.RealEstateObjects
            .Include(x => x.District)
            .Include(x => x.PropertyType)
            .Include(x => x.Photos)
            .AsQueryable();
        
        query = query.Where(x => x.Status == "Active");

        // Фильтрация
        if (request.DistrictId.HasValue) query = query.Where(x => x.DistrictId == request.DistrictId);
        if (request.MinPrice.HasValue) query = query.Where(x => x.Price >= request.MinPrice);
        if (request.MaxPrice.HasValue) query = query.Where(x => x.Price <= request.MaxPrice);
        
        if (request.PropertyTypeId.HasValue) 
            query = query.Where(x => x.PropertyTypeId == request.PropertyTypeId);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.Id)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new RealEstateCardDto(
                x.Id,
                $"{x.PropertyType.Name} на {x.Street}",
                x.Price,
                x.Area,
                x.District.Name,
                x.Photos.FirstOrDefault(p => p.IsMain).Url ?? x.Photos.FirstOrDefault().Url,
                x.Status
            ))
            .ToListAsync(cancellationToken);

        return new PagedResultDto<RealEstateCardDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
    
    public async Task<RealEstateDetailsDto?> GetDetailsByIdAsync(int id, CancellationToken ct)
    {
        var obj = await context.RealEstateObjects
            .Include(x => x.PropertyType)
            .Include(x => x.District)
            .Include(x => x.Owner)
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (obj == null) return null;

        return new RealEstateDetailsDto(
            obj.Id,
            obj.PropertyType.Name,
            obj.District.Name,
            obj.Street,
            obj.HouseNumber,
            obj.ApartmentNumber,
            obj.Price,
            obj.Area,
            obj.Description,
            obj.Status,
            obj.Photos.OrderByDescending(p => p.IsMain).Select(p => p.Url).ToList(),
            $"{obj.Owner.FirstName} {obj.Owner.LastName}",
            obj.Owner.Phone
        );
    }
}