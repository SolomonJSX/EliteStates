using MediatR;
using Microsoft.AspNetCore.Mvc;
using RealEstateAgency.Application.Features.Auth.Commands;

namespace RealEstateAgency.Host.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register-client")]
    public async Task<IActionResult> RegisterClient([FromBody] RegisterClientCommand command)
    {
        try 
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        try
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Неверный логин или пароль" });
        }
    }
}