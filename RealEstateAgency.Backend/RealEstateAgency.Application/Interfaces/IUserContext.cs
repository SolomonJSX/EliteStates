namespace RealEstateAgency.Application.Interfaces;

public interface IUserContext
{
    string? Id { get; } // Возвращает UserId из Claims
}