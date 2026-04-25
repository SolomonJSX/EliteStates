using MediatR;
using RealEstateAgency.Application.Features.Objects.Commands;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Features.Objects.Handlers;

public class CreateObjectHandler(
    IGenericRepository<RealEstateObject> objectRepo,
    IGenericRepository<Client> clientRepo,
    IIdentityService identityService) : IRequestHandler<CreateObjectCommand, int>
{
    public async Task<int> Handle(CreateObjectCommand request, CancellationToken cancellationToken)
    {
        // Проверка: если OwnerId все еще 0 или null, БД выдаст 500 ошибку при сохранении
        if (request.OwnerId == null || request.OwnerId == 0)
        {
            throw new Exception("OwnerId is required to create a RealEstateObject");
        }

        var newObject = new RealEstateObject
        {
            PropertyTypeId = request.PropertyTypeId,
            DistrictId = request.DistrictId,
            Street = request.Street,
            HouseNumber = request.HouseNumber,
            ApartmentNumber = request.ApartmentNumber,
            Price = request.Price,
            Area = request.Area,
            Description = request.Description,
            Status = "Pending",
            OwnerId = request.OwnerId.Value // Устанавливаем из команды
        };

        await objectRepo.AddAsync(newObject);
        await objectRepo.SaveChangesAsync();

        return newObject.Id;
    }
}