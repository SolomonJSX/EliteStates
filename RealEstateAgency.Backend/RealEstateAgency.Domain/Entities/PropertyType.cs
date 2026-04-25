using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RealEstateAgency.Domain.Entities
{
    public class PropertyType
    {
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Name { get; set; }
    }
}
