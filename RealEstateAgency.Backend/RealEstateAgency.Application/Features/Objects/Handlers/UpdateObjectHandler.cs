using MediatR;
using RealEstateAgency.Application.Features.Objects.Commands;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Features.Objects.Handlers;

public class UpdateObjectHandler(
    IGenericRepository<RealEstateObject> objectRepo) : IRequestHandler<UpdateObjectCommand, bool>
{
    public async Task<bool> Handle(UpdateObjectCommand request, CancellationToken cancellationToken)
    {
        // 1. Находим объект в базе
        var obj = await objectRepo.GetByIdAsync(request.Id);
        if (obj == null) return false;

        // 2. Обновляем поля
        obj.PropertyTypeId = request.PropertyTypeId;
        obj.DistrictId = request.DistrictId;
        obj.Street = request.Street;
        obj.HouseNumber = request.HouseNumber;
        obj.ApartmentNumber = request.ApartmentNumber;
        obj.Price = request.Price;
        obj.Area = request.Area;
        obj.Description = request.Description;

        // 3. Используем твой синхронный Update
        objectRepo.Update(obj); 
        
        // 4. Сохраняем изменения асинхронно
        var result = await objectRepo.SaveChangesAsync();

        return result > 0;
    }
}