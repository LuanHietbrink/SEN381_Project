using Microsoft.EntityFrameworkCore;
using PremierSolutions.Data;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PremierSolutions.EmailAPI;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<PremierSolutionsContext>(
options =>
{
    options.UseMySql(builder.Configuration.GetConnectionString("PremierSolutionsDB"),
    ServerVersion.Parse("8.0.34-mysql"));
});

builder.Services.AddDbContext<PremierSolutionsContextProcs>(
options =>
{
    options.UseMySql(builder.Configuration.GetConnectionString("PremierSolutionsDB"),
    ServerVersion.Parse("8.0.34-mysql"));
});

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();