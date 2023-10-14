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

    public virtual DbSet<GetClientServiceReq> SpGetClientServiceReqs { get; set; } = null!;

    public virtual DbSet<GetMaintenanceJobs> SpGetMaintenanceJobs { get; set; } = null!;

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
            entity.Property(e => e.ClientName);
            entity.Property(e => e.Email);
            entity.Property(e => e.ContactNumber);
            entity.Property(e => e.ContractType);
            entity.Property(e => e.EndDate);
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
    }
}