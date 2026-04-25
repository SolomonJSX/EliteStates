using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.Contracts.Commands;
using RealEstateAgency.Infrastructure.Persistence;

namespace RealEstateAgency.Api.Controllers;

[Authorize(Roles = "Admin,Employee")]
[ApiController]
[Route("api/[controller]")]
public class ContractsController(IMediator mediator, ApplicationDbContext context) : ControllerBase
{
    [Authorize(Roles = "Admin,Employee")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        // 1. Используем проекцию (Select) СРАЗУ, чтобы не тянуть из базы лишние колонки
        var query = context.Contracts
            .AsNoTracking() // Огромный плюс к скорости для Read-only запросов
            .OrderByDescending(c => c.DateCreated);

        var totalCount = await query.CountAsync();
    
        var contracts = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new ContractDto(
                c.Id,
                c.DateCreated,
                $"{c.RealEstateObject.Street}, {c.RealEstateObject.HouseNumber}",
                $"{c.Client.FirstName} {c.Client.LastName}",
                $"{c.Employee.FirstName} {c.Employee.LastName}",
                c.OperationType.Name,
                c.RealEstateObject.Price,
                c.DurationMonths,
                c.RealEstateObject.Status
            ))
            .ToListAsync();

        // Возвращаем объект с данными о пагинации
        return Ok(new { items = contracts, totalCount });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContractCommand command)
    {
        var id = await mediator.Send(command);
        return Ok(new { id });
    }
}