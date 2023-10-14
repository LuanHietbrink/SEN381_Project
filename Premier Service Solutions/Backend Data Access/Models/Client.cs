using System;
using System.Collections.Generic;

namespace PremierSolutions.Models;

public partial class Client
{
    public int ClientId { get; set; }

    public string? ClientName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? Address { get; set; }

    public string? ContactNumber { get; set; }

    public virtual ICollection<Servicecontract> Servicecontracts { get; set; } = new List<Servicecontract>();

    public virtual ICollection<Servicerequest> Servicerequests { get; set; } = new List<Servicerequest>();
}
