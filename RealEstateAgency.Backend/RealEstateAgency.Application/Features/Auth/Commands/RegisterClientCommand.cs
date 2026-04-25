using MediatR;
using RealEstateAgency.Application.DTOs;

namespace RealEstateAgency.Application.Features.Auth.Commands;

public record RegisterClientCommand(
    string Email, 
    string Password, 
    string FirstName, 
    string LastName, 
    string Phone
) : IRequest<RegistrationResponseDto>;