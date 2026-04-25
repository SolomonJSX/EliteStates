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
        // 1. Берем инфу из Identity
        var (email, avatarUrl, role) = await _identityService.GetUserInfoAsync(request.UserId);
        if (email == null) throw new Exception("User not found");

        // 2. Достаем специфичные данные в зависимости от роли
        if (role == "Client")
        {
            // Нам нужно найти клиента по UserId. 
            // В IGenericRepository стоит добавить метод FindByCondition или использовать GetAll и фильтровать (что хуже)
            // Для простоты сейчас допустим, что мы расширили репозиторий или используем спецификацию
            var clients = await _clientRepo.GetAllAsync();
            var client = clients.FirstOrDefault(c => c.UserId == request.UserId);

            return new UserProfileDto(
                request.UserId, email, avatarUrl,
                client?.FirstName ?? "", client?.LastName ?? "", client?.MiddleName, client?.Phone,
                role, client?.City, client?.Street, client?.House
            );
        }

        // Аналогично для Employee...
        return new UserProfileDto(request.UserId, email, avatarUrl, "Admin", "", null, null, role, null, null, null);
    }
}