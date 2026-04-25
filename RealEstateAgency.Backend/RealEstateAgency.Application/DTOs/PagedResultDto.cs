namespace RealEstateAgency.Application.DTOs;

/// <summary>
/// Универсальный контейнер для данных с пагинацией
/// </summary>
/// <typeparam name="T">Тип данных (например, RealEstateCardDto)</typeparam>
public class PagedResultDto<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    
    // Вспомогательное поле: сколько всего страниц
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);

    public PagedResultDto(List<T> items, int totalCount, int pageNumber, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}