namespace PremierSolutions.Procedures
{
    public class GetActiveJobs
    {
        public int RequestId { get; set; }

        public int? ClientId { get; set; }

        public int? EmpId { get; set; }

        public DateTime RequestDate { get; set; }

        public string RequestDetails { get; set; } = null!;

        public string Status { get; set; } = null!;
    }
}