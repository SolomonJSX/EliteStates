using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RealEstateAgency.Domain.Entities
{
    public class Client
    {
        public int Id { get; set; }
        [Required] public string LastName { get; set; }
        [Required] public string FirstName { get; set; }
        public string? MiddleName { get; set; }

        public string? City { get; set; }   
        public string? Street { get; set; } 
        public string? House { get; set; }

        public string Phone { get; set; }
        public bool IsLegalEntity { get; set; }
        
        public string UserId { get; set; } 
        public ApplicationUser User { get; set; }
    }
}
