using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAgency.Application.DTOs;
using RealEstateAgency.Application.Features.Objects.Commands;
using RealEstateAgency.Application.Features.Objects.Queries;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;
using RealEstateAgency.Infrastructure.Persistence;

namespace RealEstateAgency.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ObjectsController(
    IGenericRepository<Client> clientRepo, 
    IGenericRepository<RealEstateObject> objectRepo, 
    IFileStorageService fileStorage, 
    IMediator mediator,
    IGenericRepository<RealEstatePhoto> photoRepo
    ) : ControllerBase
{

    [HttpGet("by-street/{street}")]
    public async Task<ActionResult<IEnumerable<RealEstateObjectDto>>> GetByStreet(string street)
    {
        var query = new GetObjectsByStreetQuery(street);
        var result = await mediator.Send(query);
        return Ok(result);
    }
    
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateObjectCommand command)
    {
        // Проверяем, что ID в URL совпадает с ID в теле запроса
        if (id != command.Id) return BadRequest("ID объекта не совпадает");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        // Если редактирует Клиент, проверим, что объект принадлежит ему
        if (role == "Client")
        {
            var obj = await objectRepo.GetByIdAsync(id);
            if (obj == null) return NotFound();

            var clients = await clientRepo.GetAllAsync();
            var client = clients.FirstOrDefault(c => c.UserId == userId);

            if (client == null || obj.OwnerId != client.Id)
            {
                return Forbid("Вы не можете редактировать чужое объявление");
            }
        }

        var result = await mediator.Send(command);
        return result ? Ok() : BadRequest("Не удалось обновить объект");
    }
    
    [Authorize]
    [HttpDelete("{objectId}/photos/{photoId}")]
    public async Task<IActionResult> DeletePhoto(int objectId, int photoId)
    {
        var photo = await photoRepo.GetByIdAsync(photoId);
    
        if (photo == null || photo.RealEstateObjectId != objectId) 
            return NotFound("Фотография не найдена");

        // Проверка прав (владелец объекта или админ) может быть добавлена здесь

        photoRepo.Delete(photo);
        await photoRepo.SaveChangesAsync();
    
        return Ok(new { message = "Фото удалено" });
    }
    
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateObjectCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (role == "Client")
        {
            var clients = await clientRepo.GetAllAsync();
            var client = clients.FirstOrDefault(c => c.UserId == userId);
            
            if (client == null) return BadRequest("Профиль клиента не найден");
            
            // Принудительно устанавливаем владельца
            command = command with { OwnerId = client.Id };
        }

        var id = await mediator.Send(command);
        return Ok(new { id });
    }
    
    [HttpPost("{objectId}/photos")]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> Upload(int objectId, IFormFile[] files)
    {
        if (files == null || files.Length == 0) return BadRequest("Файлы не выбраны");

        // 1. Проверяем, существует ли объект
        var realEstateObject = await objectRepo.GetByIdAsync(objectId);
        if (realEstateObject == null) return NotFound("Объект не найден");
        
        // (Опционально) Здесь можно добавить проверку, что объект принадлежит текущему юзеру

        var uploadedPhotos = new List<RealEstatePhoto>();
        var isFirstPhoto = !await photoRepo.GetAllAsync() // Проверяем, есть ли уже фото у объекта
            .ContinueWith(t => t.Result.Any(p => p.RealEstateObjectId == objectId));

        // 2. Обрабатываем каждый файл
        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            // Определяем целевую папку: objects/ID_ОБЪЕКТА
            var folderName = Path.Combine("objects", objectId.ToString());

            using (var stream = file.OpenReadStream())
            {
                var fileUrl = await fileStorage.SaveFileAsync(stream, file.FileName, folderName);

                var photo = new RealEstatePhoto
                {
                    RealEstateObjectId = objectId,
                    Url = fileUrl,
                    IsMain = isFirstPhoto // Первое загруженное фото делаем главным
                };

                await photoRepo.AddAsync(photo);
                uploadedPhotos.Add(photo);
                
                // После первой фотографии флаг IsFirst сбрасываем
                if (isFirstPhoto) isFirstPhoto = false;
            }
        }

        await photoRepo.SaveChangesAsync();
        return Ok(uploadedPhotos.Select(p => new { p.Id, p.Url, p.IsMain }));
    }
    
    [AllowAnonymous] // Каталог видят все
    [HttpGet]
    public async Task<IActionResult> GetListing([FromQuery] GetListingQuery query)
    {
        return Ok(await mediator.Send(query));
    }
    
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await mediator.Send(new GetObjectByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }
    
    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyObjects([FromServices] ApplicationDbContext context)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var query = context.RealEstateObjects
            .Include(x => x.PropertyType)
            .Include(x => x.District)
            .Include(x => x.Photos)
            .Include(x => x.Owner)
            .AsQueryable();

        // Если это Клиент, показываем только его объекты
        if (role == "Client")
        {
            // Предполагается, что у Client есть связь с UserId
            query = query.Where(x => x.Owner.UserId == userId); 
        }
        // Если Admin/Employee — показываем все (или можно добавить логику "мои добавленные")

        var objects = await query
            .OrderByDescending(x => x.Id)
            .Select(x => new RealEstateCardDto(
                x.Id,
                $"{x.PropertyType.Name} на {x.Street}",
                x.Price,
                x.Area,
                x.District.Name,
                x.Photos.FirstOrDefault(p => p.IsMain).Url ?? x.Photos.FirstOrDefault().Url,
                x.Status
            ))
            .ToListAsync();

        return Ok(objects);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteObject(int id, [FromServices] ApplicationDbContext context)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var obj = await context.RealEstateObjects
            .Include(x => x.Owner)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (obj == null) return NotFound("Объект не найден");

        // Проверка прав: Клиент может удалять только своё. Админ — всё.
        if (role == "Client" && obj.Owner.UserId != userId)
        {
            return Forbid("У вас нет прав на удаление этого объекта");
        }

        context.RealEstateObjects.Remove(obj);
        await context.SaveChangesAsync();

        return Ok(new { message = "Объект успешно удален" });
    }
    
    [Authorize(Roles = "Admin,Employee")] // Только для персонала
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingObjects([FromServices] ApplicationDbContext context)
    {
        var objects = await context.RealEstateObjects
            .Include(x => x.PropertyType)
            .Include(x => x.District)
            .Include(x => x.Photos)
            .Where(x => x.Status == "Pending")
            .OrderBy(x => x.Id)
            .Select(x => new RealEstateCardDto(
                x.Id,
                $"{x.PropertyType.Name} на {x.Street}",
                x.Price,
                x.Area,
                x.District.Name,
                x.Photos.FirstOrDefault(p => p.IsMain).Url ?? x.Photos.FirstOrDefault().Url,
                x.Status
            ))
            .ToListAsync();

        return Ok(objects);
    }

    [Authorize(Roles = "Admin,Employee")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] ChangeStatusDto dto, [FromServices] ApplicationDbContext context)
    {
        var obj = await context.RealEstateObjects.FindAsync(id);
        if (obj == null) return NotFound("Объект не найден");

        // Меняем статус (например, на "Active" или "Rejected")
        obj.Status = dto.Status;
        await context.SaveChangesAsync();

        return Ok(new { message = $"Статус изменен на {dto.Status}" });
    }

// DTO для метода выше (можешь добавить прямо в конец контроллера или в папку DTOs)
    public record ChangeStatusDto(string Status);
}