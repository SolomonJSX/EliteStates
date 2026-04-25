using System.ComponentModel.DataAnnotations;

namespace RealEstateAgency.Domain.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        
        [Required] public string LastName { get; set; }
        [Required] public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        
        // ДОБАВЛЯЕМ ЭТИ ПОЛЯ:
        public string? Phone { get; set; } 
        public string? Position { get; set; }

        public List<Contract> Contracts { get; set; } = new();
        
        public string UserId { get; set; } 
        public ApplicationUser User { get; set; }
    }
}