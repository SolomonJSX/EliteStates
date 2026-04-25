using MediatR;

namespace RealEstateAgency.Application.Features.Admin.Commands;

public record RegisterEmployeeCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string Phone,
    string Position,
    string? AvatarUrl
) : IRequest<bool>;