using MediatR;
using Microsoft.AspNetCore.Identity;
using RealEstateAgency.Application.Features.Admin.Commands;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Features.Admin.Handlers;

public class RegisterEmployeeHandler(
    UserManager<ApplicationUser> userManager,
    IGenericRepository<Employee> employeeRepository) : IRequestHandler<RegisterEmployeeCommand, bool>
{
    public async Task<bool> Handle(RegisterEmployeeCommand request, CancellationToken cancellationToken)
    {
        var user = new ApplicationUser 
        { 
            UserName = request.Email, 
            Email = request.Email,
            AvatarUrl = request.AvatarUrl, // <-- Присваиваем фото
            CreatedAt = DateTime.UtcNow 
        };

        var result = await userManager.CreateAsync(user, request.Password);
        
        if (!result.Succeeded) return false;

        await userManager.AddToRoleAsync(user, "Employee");

        var employee = new Employee
        {
            UserId = user.Id,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Position = request.Position
        };

        await employeeRepository.AddAsync(employee);
        await employeeRepository.SaveChangesAsync();

        return true;
    }
}