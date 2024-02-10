using Microsoft.EntityFrameworkCore;
using MonitoringMicroserviceNET.Data;
using MonitoringMicroserviceNET.Models;

namespace MonitoringMicroserviceNET.Repos;

public class LimitRepo
{
    private readonly MonitoringDbContext _context;
    
    public LimitRepo(MonitoringDbContext context)
    {
        _context = context;
    }
    
    public async Task<Limit> GetLimitByIdAsync(Guid id)
    {
        return await _context.Limits.FindAsync(id);
    }
    
    public async Task<IEnumerable<Limit>> GetAllLimitsAsync()
    {
        return await _context.Limits.ToListAsync();
    }
    
    public async Task<Limit> CreateLimitAsync(Limit limit)
    {
        limit.Id = new Guid();
        await _context.Limits.AddAsync(limit);
        await _context.SaveChangesAsync();
        return limit;
    }
    
    public async Task<bool> UpdateLimitAsync(Limit limit)
    {
        _context.Limits.Update(limit);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task DeleteLimitAsync(Guid id)
    {
        var limit = await GetLimitByIdAsync(id);
        if (limit == null) throw new Exception("Limit not found");
        _context.Limits.Remove(limit);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteLimitsAsync(IEnumerable<Limit> limits)
    {
        _context.Limits.RemoveRange(limits);
        await _context.SaveChangesAsync();
    }
    
    public async Task<IEnumerable<Limit>> GetLimitsByDevice(Guid deviceId)
    {
        return await _context.Limits.Where(l => l.DeviceId == deviceId).ToListAsync();
    }

    public async Task<Limit> GetLimitByDevice(Guid deviceId)
    {
        return await _context.Limits.FirstOrDefaultAsync(l => l.DeviceId == deviceId);
    }
}