using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAgency.Infrastructure.Persistence;

[Authorize(Roles = "Admin,Employee")]
[ApiController]
[Route("api/[controller]")]
public class ReportsController(ApplicationDbContext context) : ControllerBase
{
    // ЗАДАНИЕ 1.1: Сумма прихода по каждому из сотрудников в текущем месяце
    [HttpGet("income-by-employee")]
    public async Task<IActionResult> GetIncomeByEmployee()
    {
        var now = DateTime.UtcNow;
        var result = await context.Payments
            .Include(p => p.Contract).ThenInclude(c => c.Employee)
            .Where(p => p.PaymentDate.Month == now.Month && p.PaymentDate.Year == now.Year)
            .GroupBy(p => new { p.Contract.Employee.FirstName, p.Contract.Employee.LastName })
            .Select(g => new {
                EmployeeName = $"{g.Key.FirstName} {g.Key.LastName}",
                TotalAmount = g.Sum(p => p.Amount)
            }).ToListAsync();
        return Ok(result);
    }

    // ЗАДАНИЕ 1.3: Сколько объектов недвижимости зарегистрировано в каждом из районов
    [HttpGet("objects-count-by-district")]
    public async Task<IActionResult> GetObjectsCountByDistrict()
    {
        var result = await context.RealEstateObjects
            .Include(o => o.District)
            .GroupBy(o => o.District.Name)
            .Select(g => new { DistrictName = g.Key, Count = g.Count() })
            .ToListAsync();
        return Ok(result);
    }

    // ЗАДАНИЕ 1.4: Список владельцев, с недвижимостью которых совершалась «I-ая» операция
    [HttpGet("owners-by-operation/{operationTypeId}")]
    public async Task<IActionResult> GetOwnersByOperation(int operationTypeId)
    {
        var result = await context.Contracts
            .Include(c => c.RealEstateObject).ThenInclude(o => o.Owner)
            .Where(c => c.OperationTypeId == operationTypeId)
            .Select(c => new {
                OwnerName = $"{c.RealEstateObject.Owner.FirstName} {c.RealEstateObject.Owner.LastName}",
                ObjectAddress = $"{c.RealEstateObject.Street}, {c.RealEstateObject.HouseNumber}",
                Date = c.DateCreated
            }).Distinct().ToListAsync();
        return Ok(result);
    }

    // ЗАДАНИЕ 2.2: Финансовый отчет на «I-ю» дату «j-го» сотрудника
    [HttpGet("financial-report")]
    public async Task<IActionResult> GetFinancialReport([FromQuery] DateTime date, [FromQuery] int employeeId)
    {
        var payments = await context.Payments
            .Include(p => p.Contract)
            .Where(p => p.Contract.EmployeeId == employeeId && p.PaymentDate.Date == date.Date)
            .Select(p => new {
                p.Id,
                p.Amount,
                p.ContractId,
                ObjectAddress = p.Contract.RealEstateObject.Street
            }).ToListAsync();

        return Ok(new {
            TotalAmount = payments.Sum(x => x.Amount),
            Payments = payments
        });
    }

    // ЗАДАНИЕ 2.3: Список типов объектов недвижимости, с которыми совершалась «I-ая» операция в текущем году
    [HttpGet("property-types-by-operation")]
    public async Task<IActionResult> GetTypesByOperation([FromQuery] int operationTypeId)
    {
        var currentYear = DateTime.UtcNow.Year;
        var result = await context.Contracts
            .Include(c => c.RealEstateObject).ThenInclude(o => o.PropertyType)
            .Where(c => c.OperationTypeId == operationTypeId && c.DateCreated.Year == currentYear)
            .Select(c => c.RealEstateObject.PropertyType.Name)
            .Distinct().ToListAsync();
        return Ok(result);
    }
}