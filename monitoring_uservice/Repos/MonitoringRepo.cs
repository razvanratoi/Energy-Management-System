using Microsoft.EntityFrameworkCore;
using MonitoringMicroserviceNET.Data;
using MonitoringMicroserviceNET.Models;

namespace MonitoringMicroserviceNET.Repos;

public class MonitoringRepo
{
    private readonly MonitoringDbContext _context;
    
    public MonitoringRepo(MonitoringDbContext context)
    {
        _context = context;
    }
    
    public async Task<Monitoring> GetMonitoringByIdAsync(Guid id)
    {
        return await _context.Record.FindAsync(id);
    }
    
    public async Task<IEnumerable<Monitoring>> GetAllMonitoringAsync()
    {
        return await _context.Record.ToListAsync();
    }
    
    public async Task<Monitoring> CreateMonitoringAsync(Monitoring monitoring)
    {
        monitoring.Id = new Guid();
        await _context.Record.AddAsync(monitoring);
        await _context.SaveChangesAsync();
        return monitoring;
    }
    
    public async Task UpdateMonitoringAsync(Monitoring monitoring)
    {
        _context.Record.Update(monitoring);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteMonitoringAsync(Guid id)
    {
        var monitoring = await GetMonitoringByIdAsync(id);
        if (monitoring == null) throw new Exception("Monitoring not found");
        _context.Record.Remove(monitoring);
        await _context.SaveChangesAsync();
    }
}