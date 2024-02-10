using MonitoringMicroserviceNET.Models;
using MonitoringMicroserviceNET.Repos;

namespace MonitoringMicroserviceNET.Services;

public class MonitoringService
{
    private readonly MonitoringRepo _repo;
    
    public MonitoringService(MonitoringRepo repo)
    {
        _repo = repo;
    }
    
    public async Task<Monitoring> GetMonitoringByIdAsync(Guid id)
    {
        return await _repo.GetMonitoringByIdAsync(id);
    }
    
    public async Task<List<Monitoring>> GetAllMonitoringAsync()
    {
        var monitorings = await _repo.GetAllMonitoringAsync();
        
        return monitorings.ToList();
    }
    
    public Monitoring CreateMonitoring(Monitoring monitoring)
    {
        monitoring.Id = new Guid();
        return _repo.CreateMonitoringAsync(monitoring).Result;
    }
    
    public async Task UpdateMonitoring(Monitoring monitoring)
    {
        await _repo.UpdateMonitoringAsync(monitoring);
    }
    
    public async Task DeleteMonitoring(Guid id)
    {
        await _repo.DeleteMonitoringAsync(id);
    }
    
    public async Task<IEnumerable<Monitoring>> GetMonitoringByDeviceId(Guid deviceId)
    {
        var monitoring = await _repo.GetAllMonitoringAsync();
        return monitoring.Where(m => m.DeviceId == deviceId);
    }
    
    
    public async Task<IEnumerable<Monitoring>> GetMonitoringByDay(DateTime day)
    {
        var monitoring = await _repo.GetAllMonitoringAsync();
        return monitoring.Where(m =>
        {
            //get the milliseconds of the start of the day parameter and also the milliseconds of the end of the day parameter
            var startOfDay = new DateTime(day.Year, day.Month, day.Day, 0, 0, 0, DateTimeKind.Utc);
            var endOfDay = new DateTime(day.Year, day.Month, day.Day, 23, 59, 59, DateTimeKind.Utc);
            var startOfDayMilliseconds = startOfDay.Ticks / TimeSpan.TicksPerMillisecond;
            var endOfDayMilliseconds = endOfDay.Ticks / TimeSpan.TicksPerMillisecond;
            return long.Parse(m.Timestamp.ToString()) >= startOfDayMilliseconds && long.Parse(m.Timestamp.ToString()) <= endOfDayMilliseconds;
        });
    }
    
    public async Task<bool> DeleteAllMonitoring()
    {
        var monitorings = await _repo.GetAllMonitoringAsync();
        foreach(var monitoring in monitorings)
        {
            await _repo.DeleteMonitoringAsync(monitoring.Id);
        }

        return true;
    }
}