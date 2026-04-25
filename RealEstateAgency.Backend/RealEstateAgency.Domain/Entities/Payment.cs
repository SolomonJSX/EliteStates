using System;
using System.Collections.Generic;
using System.Text;

namespace RealEstateAgency.Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public Contract Contract { get; set; }

        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
    }
}
