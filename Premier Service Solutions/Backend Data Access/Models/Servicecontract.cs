using System;
using System.Collections.Generic;

namespace PremierSolutions.Models;

public partial class Servicecontract
{
    public int ContractId { get; set; }

    public int? ClientId { get; set; }

    public int? PackageId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string ContractType { get; set; } = null!;

    public string? ServiceLevel { get; set; }

    public virtual Client? Client { get; set; }

    public virtual Packagetracking? Package { get; set; }
}
