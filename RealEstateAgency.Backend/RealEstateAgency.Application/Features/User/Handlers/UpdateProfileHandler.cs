using MediatR;
using RealEstateAgency.Application.Features.User.Commands;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Features.User.Handlers;

public class UpdateProfileHandler(
    IIdentityService identityService,
    IGenericRepository<Client> clientRepo,
    IGenericRepository<Employee> employeeRepo) : IRequestHandler<UpdateProfileCommand, bool>
{
    public async Task<bool> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var (_, _, role) = await identityService.GetUserInfoAsync(request.UserId);

        if (role == "Client")
        {
            var clients = await clientRepo.GetAllAsync();
            var client = clients.FirstOrDefault(c => c.UserId == request.UserId);
            if (client == null) return false;

            client.FirstName = request.FirstName;
            client.LastName = request.LastName;
            client.MiddleName = request.MiddleName;
            client.Phone = request.Phone ?? client.Phone;
            client.City = request.City;
            client.Street = request.Street;
            client.House = request.House;

            clientRepo.Update(client);
            await clientRepo.SaveChangesAsync();
            return true;
        }
        
        // Логика для Employee аналогична...
        return false;
    }
}