using Microsoft.EntityFrameworkCore;
using UsersMicroservice.Models;
using Microsoft.Extensions.Configuration;

namespace UsersMicroservice.Data;

public class UsersDbContext : DbContext
{
    public UsersDbContext(DbContextOptions context) : base(context) { }
    public DbSet<User> User { get; set; }
}