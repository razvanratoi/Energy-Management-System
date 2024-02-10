using DeviceMicroservice.Models;
using Microsoft.EntityFrameworkCore;

namespace DeviceMicroservice.Data;

public class DevicesDbContext : DbContext
{
    public DevicesDbContext(DbContextOptions context) : base(context) { }
    public DbSet<Device> Device { get; set; }
    public DbSet<Mapping> UserDevice { get; set; }
}