using RealEstateAgency.Application.Interfaces;

namespace RealEstateAgency.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string folderName)
    {
        // Базовая папка wwwroot
        var baseRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var targetFolder = Path.Combine(baseRoot, folderName);

        // Создаем папку, если её нет
        if (!Directory.Exists(targetFolder)) Directory.CreateDirectory(targetFolder);

        // Генерируем уникальное имя, чтобы избежать конфликтов
        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var fullPath = Path.Combine(targetFolder, uniqueFileName);

        // Сохраняем файл на диск
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        // Возвращаем относительный URL (важно: используем прямые слэши для веба)
        return $"/{folderName.Replace("\\", "/")}/{uniqueFileName}";
    }
}