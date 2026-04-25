namespace RealEstateAgency.Application.DTOs;

public record ContractDto(
    int Id,
    DateTime DateCreated,
    string ObjectAddress,
    string ClientName,
    string EmployeeName,
    string OperationType,
    decimal Price,
    int DurationMonths,
    string Status
);