using System;
using System.Collections.Generic;
using System.Text;

namespace RealEstateAgency.Domain.Entities
{
    public class Contract
    {
        public int Id { get; set; }
        public DateTime DateCreated { get; set; }

        public int RealEstateObjectId { get; set; }
        public RealEstateObject RealEstateObject { get; set; }

        public int ClientId { get; set; } // Покупатель/Арендатор
        public Client Client { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        public int OperationTypeId { get; set; }
        public OperationType OperationType { get; set; }

        public int DurationMonths { get; set; } // Период действия
        public string Note { get; set; }

        // Связь с платежами (Касса)
        public List<Payment> Payments { get; set; } = new();
    }
}
