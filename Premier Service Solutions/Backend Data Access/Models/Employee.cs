using System;
using System.Collections.Generic;

namespace PremierSolutions.Models;

public partial class Employee
{
    public int EmpId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? ContactNumber { get; set; }

    public string? EmgContact { get; set; }

    public string? Skills { get; set; }

    public virtual ICollection<Servicerequest> Servicerequests { get; set; } = new List<Servicerequest>();
}
