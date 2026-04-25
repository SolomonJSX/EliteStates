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
        // 1. Получаем роль пользователя
        var (_, _, role) = await identityService.GetUserInfoAsync(request.UserId);

        // 2. Обновляем данные в таблице Microsoft Identity (через сервис)
        // Нам нужно, чтобы в AspNetUsers тоже поменялись FirstName/LastName
        await identityService.UpdateUserAsync(request.UserId, request.FirstName, request.LastName, request.Phone);

        if (role == "Client")
        {
            var clients = await clientRepo.FindAsync(c => c.UserId == request.UserId);
            var client = clients.FirstOrDefault();
            
            if (client != null)
            {
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
        }
        else if (role == "Employee" || role == "Admin")
        {
            // --- ДОБАВЛЕННАЯ ЛОГИКА ДЛЯ СОТРУДНИКА ---
            var employees = await employeeRepo.FindAsync(e => e.UserId == request.UserId);
            var employee = employees.FirstOrDefault();

            if (employee != null)
            {
                employee.FirstName = request.FirstName;
                employee.LastName = request.LastName;
                employee.Phone = request.Phone ?? employee.Phone;
                // Если у Employee есть MiddleName или другие поля — добавь их сюда

                employeeRepo.Update(employee);
                await employeeRepo.SaveChangesAsync();
                return true;
            }
        }
        
        return false;
    }
}