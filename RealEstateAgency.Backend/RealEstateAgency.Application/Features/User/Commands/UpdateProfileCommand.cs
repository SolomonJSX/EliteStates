using MediatR;

namespace RealEstateAgency.Application.Features.User.Commands;

public record UpdateProfileCommand : IRequest<bool>
{
    public string? UserId { get; set; } // Делаем nullable и убираем из конструктора
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public string? Phone { get; set; }
    public string? City { get; set; }
    public string? Street { get; set; }
    public string? House { get; set; }
}