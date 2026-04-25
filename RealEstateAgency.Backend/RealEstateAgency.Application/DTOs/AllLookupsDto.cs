namespace RealEstateAgency.Application.DTOs;

public record AllLookupsDto(
    List<LookupItemDto> Districts,
    List<LookupItemDto> PropertyTypes,
    List<LookupItemDto> OperationTypes
);