namespace PremierSolutions.Procedures
{
    public class GetActiveContracts
    {
        public int ContractId { get; set; }

        public int? ClientId { get; set; }

        public int? PackageId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string ContractType { get; set; } = null!;
    }
}