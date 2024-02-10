using Microsoft.EntityFrameworkCore;
using MonitoringMicroserviceNET.Models;

namespace MonitoringMicroserviceNET.Data;

public class MonitoringDbContext: DbContext
{
    public MonitoringDbContext(DbContextOptions context) : base(context) { }
    
    public DbSet<Monitoring> Record { get; set; }
    public DbSet<Limit> Limits { get; set; }
}