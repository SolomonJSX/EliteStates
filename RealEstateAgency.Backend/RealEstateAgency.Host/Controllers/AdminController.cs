using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using RealEstateAgency.Application.Features.Admin.Commands;
using RealEstateAgency.Application.Interfaces; // Для IFileStorageService

namespace RealEstateAgency.Host.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController(IMediator mediator, IFileStorageService fileStorage) : ControllerBase
{
    [HttpPost("employees")]
    // Используем [FromForm], чтобы принимать файлы и текст одновременно
    public async Task<IActionResult> AddEmployee([FromForm] RegisterEmployeeRequest request)
    {
        string? avatarUrl = null;

        // Сохраняем фото, если оно было передано
        if (request.Avatar != null && request.Avatar.Length > 0)
        {
            using var stream = request.Avatar.OpenReadStream();
            avatarUrl = await fileStorage.SaveFileAsync(stream, request.Avatar.FileName, "avatars");
        }

        var command = new RegisterEmployeeCommand(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.Phone,
            request.Position,
            avatarUrl
        );

        var result = await mediator.Send(command);
        return result ? Ok() : BadRequest("Не удалось создать сотрудника");
    }
}

// Запрос для FromForm
public record RegisterEmployeeRequest(
    string Email, 
    string Password, 
    string FirstName, 
    string LastName, 
    string Phone, 
    string Position, 
    IFormFile? Avatar // <-- Файл
);