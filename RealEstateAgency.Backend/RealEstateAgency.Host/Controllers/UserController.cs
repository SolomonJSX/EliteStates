using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.User.Commands;
using RealEstateAgency.Application.Features.User.Queries;
using RealEstateAgency.Application.Interfaces;

namespace RealEstateAgency.Host.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController(IMediator mediator, IIdentityService identityService) : ControllerBase
{
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await mediator.Send(new GetProfileQuery(userId));
        return Ok(result);
    }

    [HttpPost("upload-avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("Файл не выбран");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // 1. Определяем путь к папке avatars
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "avatars");

        // 2. ПРОВЕРКА: Если папки нет — создаем её
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // 3. Формируем имя и полный путь к файлу
        var fileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var path = Path.Combine(uploadsFolder, fileName);

        // 4. Сохраняем файл
        using (var stream = new FileStream(path, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var url = $"/avatars/{fileName}";
        await identityService.UpdateAvatarAsync(userId, url);

        return Ok(new { url });
    }
    
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        command.UserId = userId; // Принудительно ставим ID из токена
        var result = await mediator.Send(command);
    
        return result ? Ok() : BadRequest("Не удалось обновить профиль");
    }
}