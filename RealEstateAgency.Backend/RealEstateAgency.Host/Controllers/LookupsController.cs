using MediatR;
using Microsoft.AspNetCore.Mvc;
using RealEstateAgency.Application.Features.Lookups.Queries;

namespace RealEstateAgency.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await mediator.Send(new GetLookupsQuery()));
}