namespace RealEstateAgency.Application.DTOs;

public record EmployeeContractDto(
    int Id,
    DateTime DateCreated,
    string ObjectAddress,
    string ClientFullName,
    string ClientPhone,
    string OperationType, // Продажа/Аренда
    decimal DealValue,    // Сумма сделки
    string Note           // Служебные заметки
);