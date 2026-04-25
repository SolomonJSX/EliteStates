using MediatR;
using Microsoft.AspNetCore.Identity;
using RealEstateAgency.Application.Features.Auth.Commands;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Features.Auth.Handlers;

public class RegisterClientHandler(
    UserManager<ApplicationUser> userManager,
    IGenericRepository<Client> clientRepository)
    : IRequestHandler<RegisterClientCommand, RegistrationResponseDto>
{

    public async Task<RegistrationResponseDto> Handle(RegisterClientCommand request, CancellationToken cancellationToken)
    {
        var user = new ApplicationUser { UserName = request.Email, Email = request.Email };
        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

        await userManager.AddToRoleAsync(user, "Client");

        var client = new Client
        {
            UserId = user.Id,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            IsLegalEntity = false
        };

        await clientRepository.AddAsync(client);
        await clientRepository.SaveChangesAsync();

        return new RegistrationResponseDto("Регистрация прошла успешно");
    }
}