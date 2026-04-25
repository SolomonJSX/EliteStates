namespace RealEstateAgency.Application.DTOs;

public class RealEstateObjectDto
{
    public int Id { get; set; }
    public string FullAddress { get; set; } // Склеим улицу и дом
    public decimal Price { get; set; }
    public string PropertyTypeName { get; set; }
    public string DistrictName { get; set; }
}