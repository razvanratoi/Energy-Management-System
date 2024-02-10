namespace MonitoringMicroserviceNET.Models;

public class Limit
{
    public Guid Id { get; set; }
    public Guid DeviceId { get; set; }
    public double MaxHourlyConsumption { get; set; }
    
    public Limit(Guid deviceId, double maxHourlyConsumption)
    {
        Id = new Guid();
        DeviceId = deviceId;
        MaxHourlyConsumption = maxHourlyConsumption;
    }

    public override string ToString()
    {
        return $"Id: {Id}, DeviceId: {DeviceId}, MaxHourlyConsumption: {MaxHourlyConsumption}";
    }
}