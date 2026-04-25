using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateAgency.Application.Features.Payments.Commands;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Api.Controllers;

[Authorize(Roles = "Admin,Employee")]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController(IMediator mediator, IGenericRepository<Payment> paymentRepo) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentCommand command)
    {
        var id = await mediator.Send(command);
        return Ok(new { id });
    }

    [HttpGet("contract/{contractId}")]
    public async Task<IActionResult> GetByContract(int contractId)
    {
        var payments = await paymentRepo.FindAsync(p => p.ContractId == contractId);
        return Ok(payments.OrderByDescending(p => p.PaymentDate));
    }
}