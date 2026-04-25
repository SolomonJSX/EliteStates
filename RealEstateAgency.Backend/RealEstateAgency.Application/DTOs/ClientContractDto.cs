namespace RealEstateAgency.Application.DTOs;

// То, что видит Клиент в своем кабинете "Мои покупки/аренда"
public record ClientContractDto(
    int Id,
    DateTime DateCreated,
    string ObjectTitle,
    string AgentName,     // ФИО риелтора, который вел сделку
    string AgentPhone,
    string OperationType,
    decimal Price,
    int DurationMonths
);