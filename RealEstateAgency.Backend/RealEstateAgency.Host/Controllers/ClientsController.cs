using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAgency.Infrastructure.Persistence;

namespace RealEstateAgency.Api.Controllers;

[Authorize(Roles = "Admin,Employee")] // Только персонал может видеть список всех клиентов
[ApiController]
[Route("api/[controller]")]
public class ClientsController(ApplicationDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var clients = await context.Clients
            .OrderBy(c => c.LastName)
            .Select(c => new {
                c.Id,
                c.FirstName,
                c.LastName,
                c.Phone
            })
            .ToListAsync();

        return Ok(clients);
    }
}