using System;
using System.Collections.Generic;

namespace PremierSolutions.Models;

public partial class Servicerequest
{
    public int RequestId { get; set; }

    public int? ClientId { get; set; }

    public int? EmpId { get; set; }

    public DateTime? RequestDate { get; set; }

    public string? RequestDetails { get; set; } = null!;

    public string? Status { get; set; } = null!;

    public virtual Client? Client { get; set; }

    public virtual Employee? Emp { get; set; }
}
