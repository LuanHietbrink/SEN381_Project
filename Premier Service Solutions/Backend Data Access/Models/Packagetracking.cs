using System;
using System.Collections.Generic;

namespace PremierSolutions.Models;

public partial class Packagetracking
{
    public int PackageId { get; set; }

    public string? PackageName { get; set; }

    public int? Price { get; set; }

    public int? ServiceContractCount { get; set; }

    public virtual ICollection<Servicecontract> Servicecontracts { get; set; } = new List<Servicecontract>();
}
