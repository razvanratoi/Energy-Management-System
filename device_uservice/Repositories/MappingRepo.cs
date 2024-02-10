using DeviceMicroservice.Data;
using DeviceMicroservice.Models;
using Microsoft.EntityFrameworkCore;

namespace DeviceMicroservice.Repositories;

public class MappingRepo
{
    private readonly DevicesDbContext _context;

    public MappingRepo(DevicesDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Mapping>> GetAllMappingsAsync()
    {
        return await _context.UserDevice.ToListAsync();
    }

    public async Task<Mapping> CreateMappingAsync(Mapping mapping)
    {
        await _context.UserDevice.AddAsync(mapping);
        await _context.SaveChangesAsync();
        return mapping;
    }

    public async Task DeleteMappingAsync(Guid userId)
    {
        var mappings = await _context.UserDevice.Where(m => m.UserId == userId).ToListAsync();
        _context.UserDevice.RemoveRange(mappings);
        await _context.SaveChangesAsync();
    }

    public Task<List<Guid>> GetMappingsByUser(Guid userId)
    {
        return _context.UserDevice.Where(m => m.UserId == userId).Select(m => m.Id).ToListAsync();
    }

    public async Task DeleteMappings(List<Guid> mappings)
    {
        var mappingsToDelete = await _context.UserDevice
            .Where(m => mappings.Contains(m.Id))
            .ToListAsync();

        _context.UserDevice.RemoveRange(mappingsToDelete);
        await _context.SaveChangesAsync();
    }

    public Task<List<Guid>> GetMappingsByDevice(Guid deviceId)
    {
        return _context.UserDevice.Where(m => m.DeviceId == deviceId).Select(m => m.Id).ToListAsync();
    }

    public Task<List<Guid>> GetDevicesFromMappings(Guid userId)
    {
        return _context.UserDevice.Where(m => m.UserId == userId).Select(m => m.DeviceId).ToListAsync();
    }
}