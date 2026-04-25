namespace RealEstateAgency.Application.DTOs;

public record PaymentDto(
    int Id,
    int ContractId,
    DateTime PaymentDate,
    decimal Amount
);