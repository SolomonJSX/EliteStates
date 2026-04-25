using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.User.Queries;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

public class GetProfileHandler : IRequestHandler<GetProfileQuery, UserProfileDto>
{
    private readonly IIdentityService _identityService;
    private readonly IGenericRepository<Client> _clientRepo;
    private readonly IGenericRepository<Employee> _employeeRepo;

    public GetProfileHandler(
        IIdentityService identityService, 
        IGenericRepository<Client> clientRepo,
        IGenericRepository<Employee> employeeRepo)
    {
        _identityService = identityService;
        _clientRepo = clientRepo;
        _employeeRepo = employeeRepo;
    }

    public async Task<UserProfileDto> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        var (email, avatarUrl, role) = await _identityService.GetUserInfoAsync(request.UserId);
        if (email == null) throw new Exception("User not found");

        // 2. Если КЛИЕНТ
        if (role == "Client")
        {
            var clients = await _clientRepo.FindAsync(c => c.UserId == request.UserId);
            var client = clients.FirstOrDefault();

            return new UserProfileDto(
                request.UserId, email, avatarUrl,
                client?.FirstName ?? "", client?.LastName ?? "", client?.MiddleName, client?.Phone,
                role, client?.City, client?.Street, client?.House
            );
        }

        // 3. Если СОТРУДНИК или АДМИН (Исправлено здесь!)
        if (role == "Employee" || role == "Admin")
        {
            var employees = await _employeeRepo.FindAsync(e => e.UserId == request.UserId);
            var employee = employees.FirstOrDefault();

            // Теперь возвращаем реальные данные из таблицы Employees, а не заглушку "Admin"
            return new UserProfileDto(
                request.UserId, email, avatarUrl,
                employee?.FirstName ?? "Сотрудник", 
                employee?.LastName ?? "", 
                employee?.MiddleName, 
                employee?.Phone,
                role, null, null, null
            );
        }

        throw new Exception("Unknown role");
    }
}