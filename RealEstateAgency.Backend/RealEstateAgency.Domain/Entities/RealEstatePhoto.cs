namespace RealEstateAgency.Domain.Entities;

public class RealEstatePhoto
{
    public int Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; } // Главное фото для превью
    public int RealEstateObjectId { get; set; }
    public RealEstateObject RealEstateObject { get; set; }
}