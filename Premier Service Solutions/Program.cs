using Microsoft.EntityFrameworkCore;
using PremierSolutions.Data;

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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();