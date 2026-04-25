namespace RealEstateAgency.Application.DTOs;

public record AuthResponseDto(string Token, string Email, IList<string> Roles);