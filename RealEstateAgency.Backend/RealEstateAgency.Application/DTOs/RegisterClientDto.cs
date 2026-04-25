namespace RealEstateAgency.Application.DTOs;

public record RegisterClientDto(string Email, string Password, string FirstName, string LastName, string Phone);