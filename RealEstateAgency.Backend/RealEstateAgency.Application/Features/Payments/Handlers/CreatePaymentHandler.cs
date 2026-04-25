using MediatR;
using RealEstateAgency.Application.Features.Payments.Commands;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Features.Payments.Handlers;

public class CreatePaymentHandler(
    IGenericRepository<Payment> paymentRepo,
    IGenericRepository<Contract> contractRepo) : IRequestHandler<CreatePaymentCommand, int>
{
    public async Task<int> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
    {
        // 1. Проверяем, существует ли контракт
        var contract = await contractRepo.GetByIdAsync(request.ContractId);
        if (contract == null) throw new Exception("Контракт не найден");

        // 2. Создаем платеж
        var payment = new Payment
        {
            ContractId = request.ContractId,
            Amount = request.Amount,
            PaymentDate = request.PaymentDate == default ? DateTime.UtcNow : request.PaymentDate
        };

        await paymentRepo.AddAsync(payment);
        await paymentRepo.SaveChangesAsync();

        return payment.Id;
    }
}