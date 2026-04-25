using MediatR;
using RealEstateAgency.Application.DTOs;

namespace RealEstateAgency.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;