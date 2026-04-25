using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RealEstateAgency.Domain.Entities
{
    public class District
    {
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Name { get; set; }

        // Навигационное свойство: объекты в этом районе
        public List<RealEstateObject> Objects { get; set; } = new();
    }
}
