using DeviceMicroservice.Data;
using DeviceMicroservice.Models;
using Microsoft.EntityFrameworkCore;

namespace DeviceMicroservice.Repositories;

public class DeviceRepo
{
    private readonly DevicesDbContext _context;
    
    public DeviceRepo(DevicesDbContext context)
    {
        _context = context;
    }
    
    public async Task<Device> GetDeviceByIdAsync(Guid id)
    {
        return await _context.Device.FindAsync(id);
    }
    
    public async Task<IEnumerable<Device>> GetAllDevicesAsync()
    {
        return await _context.Device.ToListAsync();
    }
    
    public async Task<Device> CreateDeviceAsync(Device device)
    {
        device.Id = new Guid();
        await _context.Device.AddAsync(device);
        await _context.SaveChangesAsync();
        return device;
    }
    
    public async Task UpdateDeviceAsync(Device device)
    {
        _context.Device.Update(device);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteDeviceAsync(Guid id)
    {
        var device = await GetDeviceByIdAsync(id);
        if (device == null) throw new Exception("Device not found");
        _context.Device.Remove(device);
        await _context.SaveChangesAsync();
    }
}