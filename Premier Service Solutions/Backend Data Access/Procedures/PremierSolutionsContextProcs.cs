using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using PremierSolutions.Procedures;

namespace PremierSolutions.Data;

public partial class PremierSolutionsContextProcs : DbContext
{
    public PremierSolutionsContextProcs(DbContextOptions<PremierSolutionsContextProcs> options)
        : base(options) { 
    }

    public virtual DbSet<GetActiveContracts> SpGetActiveContracts { get; set; } = null!;

    public virtual DbSet<GetActiveJobs> SpGetActiveJobs { get; set; } = null!;

    public virtual DbSet<GetClientDetails> SpGetClientDetails { get; set; } = null!;

    public virtual DbSet<GetAllClientDetails> SpGetAllClientDetails { get; set; } = null!;

    public virtual DbSet<GetClientServiceReq> SpGetClientServiceReqs { get; set; } = null!;
    
    public virtual DbSet<GetMaintenanceJobs> SpGetMaintenanceJobs { get; set; } = null!;

    public virtual DbSet<GetEmployeeDetails> SpGetEmployeeDetails { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GetActiveContracts>(entity =>
        {
            entity.HasNoKey();
            entity.Property(e => e.ContractId);
            entity.Property(e => e.ClientId);
            entity.Property(e => e.PackageId);
            entity.Property(e => e.StartDate);
            entity.Property(e => e.EndDate);
            entity.Property(e => e.ContractType);
            entity.Property(e => e.ServiceLevel);
        });
                
        modelBuilder.Entity<GetActiveJobs>(entity =>
        {
            entity.HasNoKey();
            entity.Property(e => e.RequestId);
            entity.Property(e => e.ClientId);
            entity.Property(e => e.EmpId);
            entity.Property(e => e.RequestDate);
            entity.Property(e => e.RequestDetails);
            entity.Property(e => e.Status);
        });     

        modelBuilder.Entity<GetClientDetails>(entity =>
        {
            entity.HasNoKey();
            entity.Property(e => e.ClientId);
            entity.Property(e => e.ClientType);
            entity.Property(e => e.ClientName);
            entity.Property(e => e.Email);
            entity.Property(e => e.ContactNumber);
            entity.Property(e => e.StartDate);
            entity.Property(e => e.EndDate);
            entity.Property(e => e.ContractType);
            entity.Property(e => e.ServiceLevel);
            entity.Property(e => e.RequestId);
            entity.Property(e => e.RequestDate);
            entity.Property(e => e.RequestDetails);
            entity.Property(e => e.Status);
        });        
        
        modelBuilder.Entity<GetAllClientDetails>(entity =>
        {
            entity.HasNoKey();
            entity.Property(e => e.ClientId);
            entity.Property(e => e.ClientName);
            entity.Property(e => e.ClientType);
            entity.Property(e => e.Email);
            entity.Property(e => e.Password);
            entity.Property(e => e.Address);
            entity.Property(e => e.ContactNumber);
        });    

        modelBuilder.Entity<GetClientServiceReq>(entity =>
        {
            entity.HasNoKey();
            entity.Property(e => e.RequestId);
            entity.Property(e => e.ClientId);
            entity.Property(e => e.EmpId);
            entity.Property(e => e.RequestDate);
            entity.Property(e => e.RequestDetails);
            entity.Property(e => e.Status);
        });         
        
        modelBuilder.Entity<GetMaintenanceJobs>(entity =>
        {
            entity.HasNoKey(); 
            entity.Property(e => e.RequestId);
            entity.Property(e => e.ClientId);
            entity.Property(e => e.EmpId);
            entity.Property(e => e.RequestDate);
            entity.Property(e => e.RequestDetails);
            entity.Property(e => e.Status);
        });

        modelBuilder.Entity<GetEmployeeDetails>(entity =>
        {
            entity.HasNoKey(); 
            entity.Property(e => e.EmpId);
            entity.Property(e => e.EmployeeType);
            entity.Property(e => e.FirstName);
            entity.Property(e => e.LastName);
            entity.Property(e => e.Email);
            entity.Property(e => e.Password);
            entity.Property(e => e.ContactNumber);
            entity.Property(e => e.EmgContact);
            entity.Property(e => e.Skills);
        });
    }
}