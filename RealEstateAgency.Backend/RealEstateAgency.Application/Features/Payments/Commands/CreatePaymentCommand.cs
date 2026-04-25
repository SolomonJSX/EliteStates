using MediatR;

namespace RealEstateAgency.Application.Features.Payments.Commands;

public record CreatePaymentCommand(
    int ContractId,
    decimal Amount,
    DateTime PaymentDate
) : IRequest<int>;