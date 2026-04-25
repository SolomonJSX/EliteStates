using MediatR;

namespace RealEstateAgency.Application.Features.Contracts.Commands;

public record CreateContractCommand(
    int RealEstateObjectId,
    int ClientId,
    int OperationTypeId,
    int DurationMonths,
    string Note
) : IRequest<int>;