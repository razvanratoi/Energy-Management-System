using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace MonitoringMicroserviceNET.Models;

public class Monitoring
{
    [Key]
    public Guid Id { get; set; }
    public Guid DeviceId { get; set; }
    public double Consumption { get; set; }
    public long Timestamp { get; set; }
    
    public Monitoring(long timestamp, Guid deviceId, double consumption)
    {
        DeviceId = deviceId;
        Consumption = consumption;
        Timestamp = timestamp;
    }
}