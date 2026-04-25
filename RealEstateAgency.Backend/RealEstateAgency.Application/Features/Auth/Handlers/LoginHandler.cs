using MediatR;
using Microsoft.AspNetCore.Identity;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.Auth.Commands;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Features.Auth.Handlers;

public class LoginHandler(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ITokenService tokenService)
    : IRequestHandler<LoginCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null) throw new UnauthorizedAccessException("Неверный логин или пароль");

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded) throw new UnauthorizedAccessException("Неверный логин или пароль");

        var roles = await userManager.GetRolesAsync(user);
        var token = tokenService.CreateToken(user, roles);

        return new AuthResponseDto(token, user.Email, roles);
    }
}