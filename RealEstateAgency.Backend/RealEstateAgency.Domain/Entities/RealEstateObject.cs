using System;
using System.Collections.Generic;
using System.Text;

namespace RealEstateAgency.Domain.Entities
{
    public class RealEstateObject
    {
        public int Id { get; set; }

        // Связи (Внешние ключи)
        public int PropertyTypeId { get; set; }
        public PropertyType PropertyType { get; set; }

        public int DistrictId { get; set; }
        public District District { get; set; }

        public int OwnerId { get; set; }
        public Client Owner { get; set; }

        // Адрес объекта
        public string Street { get; set; }
        public string HouseNumber { get; set; }
        public int? ApartmentNumber { get; set; }

        public decimal Price { get; set; }
        public double Area { get; set; } // Площадь
        public string Description { get; set; }
        public string Status { get; set; } // Выставлен, Продан и т.д.
        
        public List<RealEstatePhoto> Photos { get; set; } = new();
    }
}
