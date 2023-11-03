namespace PremierSolutions.Procedures
{
    public class GetClientDetails
    {
        public int ClientId { get; set; }

        public string? ClientType { get; set; }

        public string? ClientName { get; set; }

        public string? Email { get; set; }

        public string? ContactNumber { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string? ContractType { get; set; } = null!;

        public string? ServiceLevel { get; set; }
    }
}