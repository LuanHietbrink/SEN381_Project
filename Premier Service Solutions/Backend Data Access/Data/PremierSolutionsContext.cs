using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using PremierSolutions.Models;

namespace PremierSolutions.Data;

public partial class PremierSolutionsContext : DbContext
{
    public PremierSolutionsContext(DbContextOptions<PremierSolutionsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Packagetracking> Packagetrackings { get; set; }

    public virtual DbSet<Servicecontract> Servicecontracts { get; set; }

    public virtual DbSet<Servicerequest> Servicerequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.ClientId).HasName("PRIMARY");

            entity.ToTable("client");

            entity.HasIndex(e => e.ClientId, "idxClient_ClientID");

            entity.Property(e => e.ClientId).HasColumnName("ClientID");
            entity.Property(e => e.Address)
                .HasMaxLength(50)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.ClientName)
                .HasMaxLength(100)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.ContactNumber)
                .HasMaxLength(15)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmpId).HasName("PRIMARY");

            entity.ToTable("employee");

            entity.HasIndex(e => e.EmpId, "idxTechnician_EmpID");

            entity.Property(e => e.EmpId).HasColumnName("EmpID");
            entity.Property(e => e.ContactNumber)
                .HasMaxLength(15)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.EmgContact)
                .HasMaxLength(15)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Skills)
                .HasMaxLength(100)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
        });

        modelBuilder.Entity<Packagetracking>(entity =>
        {
            entity.HasKey(e => e.PackageId).HasName("PRIMARY");

            entity.ToTable("packagetracking");

            entity.Property(e => e.PackageId).HasColumnName("PackageID");
            entity.Property(e => e.PackageName)
                .HasMaxLength(50)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.ServiceContractCount).HasDefaultValueSql("'0'");
        });

        modelBuilder.Entity<Servicecontract>(entity =>
        {
            entity.HasKey(e => e.ContractId).HasName("PRIMARY");

            entity.ToTable("servicecontract");

            entity.HasIndex(e => e.ClientId, "ClientID");

            entity.HasIndex(e => e.PackageId, "PackageID");

            entity.HasIndex(e => e.ContractId, "idxServiceContract_ContractID");

            entity.Property(e => e.ContractId).HasColumnName("ContractID");
            entity.Property(e => e.ClientId).HasColumnName("ClientID");
            entity.Property(e => e.ContractType)
                .HasMaxLength(30)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.PackageId).HasColumnName("PackageID");
            entity.Property(e => e.ServiceLevel)
                .HasMaxLength(30)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.StartDate).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Servicecontracts)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("servicecontract_ibfk_1");

            entity.HasOne(d => d.Package).WithMany(p => p.Servicecontracts)
                .HasForeignKey(d => d.PackageId)
                .HasConstraintName("servicecontract_ibfk_2");
        });

        modelBuilder.Entity<Servicerequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PRIMARY");

            entity.ToTable("servicerequest");

            entity.HasIndex(e => e.ClientId, "ClientID");

            entity.HasIndex(e => e.EmpId, "EmpID");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.ClientId).HasColumnName("ClientID");
            entity.Property(e => e.EmpId).HasColumnName("EmpID");
            entity.Property(e => e.RequestDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.RequestDetails)
                .HasMaxLength(100)
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValueSql("'In Progress'")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");

            entity.HasOne(d => d.Client).WithMany(p => p.Servicerequests)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("servicerequest_ibfk_1");

            entity.HasOne(d => d.Emp).WithMany(p => p.Servicerequests)
                .HasForeignKey(d => d.EmpId)
                .HasConstraintName("servicerequest_ibfk_2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
