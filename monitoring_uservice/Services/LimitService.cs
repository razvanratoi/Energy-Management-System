using MonitoringMicroserviceNET.Models;
using MonitoringMicroserviceNET.Repos;

namespace MonitoringMicroserviceNET.Services;

public class LimitService
{
    private readonly LimitRepo _limitRepo;
    
    public LimitService(LimitRepo limitRepo)
    {
        _limitRepo = limitRepo;
    }
    
    public IEnumerable<Limit> GetAllLimits()
    {
        return _limitRepo.GetAllLimitsAsync().Result;
    }
    
    public Limit CreateLimit(Limit limit)
    {
        limit.Id = new Guid();
        return _limitRepo.CreateLimitAsync(limit).Result;
    }
    
    public async void DeleteLimit(Guid id)
    {
        await _limitRepo.DeleteLimitAsync(id);
    }
    
    public async Task DeleteLimitsByDevice(Guid deviceId)
    {
        var limits = _limitRepo.GetLimitsByDevice(deviceId).Result;
        await _limitRepo.DeleteLimitsAsync(limits);
    }
    
    public bool UpdateLimit(Limit limit)
    {
        return _limitRepo.UpdateLimitAsync(limit).Result;
    }
    
    public async Task<Limit> GetLimitById(Guid id)
    {
        return await _limitRepo.GetLimitByIdAsync(id);
    }
    
    public async Task<IEnumerable<Limit>> GetLimitsByDevice(Guid deviceId)
    {
        return await _limitRepo.GetLimitsByDevice(deviceId);
    }
    
    public Limit GetLimitByDevice(Guid deviceId)
    {
        return _limitRepo.GetLimitByDevice(deviceId).Result;
    }
}