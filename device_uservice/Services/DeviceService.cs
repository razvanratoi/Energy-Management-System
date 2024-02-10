using System.Text;
using DeviceMicroservice.Models;
using DeviceMicroservice.Repositories;
using DeviceMicroservice.Producer;

namespace DeviceMicroservice.Services;

public class DeviceService
{
    private readonly DeviceRepo _deviceRepo;
    private readonly MappingRepo _mappingRepo;
    private readonly Producer.Producer _producer;
    
    public DeviceService(DeviceRepo deviceRepo, MappingRepo mappingRepo, Producer.Producer producer)
    {
        _deviceRepo = deviceRepo;
        _mappingRepo = mappingRepo;
        _producer = producer;
    }
    
    public async Task<Device> GetDeviceByIdAsync(Guid id)
    {
        return await _deviceRepo.GetDeviceByIdAsync(id);
    }
    
    public async Task<IEnumerable<Device>> GetAllDevices()
    {
        return await _deviceRepo.GetAllDevicesAsync();
    }
    
    public async Task<Device> CreateDevice(Device device)
    {
        _producer.AlertDeviceCreation(device);
        var createdDevice = await _deviceRepo.CreateDeviceAsync(device);
        _producer.AlertDeviceCreation(createdDevice);
        return createdDevice;
    }
    
    public async Task UpdateDevice(Device device)
    {
        _producer.AlertDeviceCreation(device);
        await _deviceRepo.UpdateDeviceAsync(device);
    }
    
    public async Task DeleteDevice(Guid id)
    {
        await _deviceRepo.DeleteDeviceAsync(id);
    }

    public async Task<IEnumerable<Device>> GetDevicesByUserId(Guid userId)
    {
        var deviceIds = _mappingRepo.GetDevicesFromMappings(userId).Result;
        var devices = new List<Device>();
        foreach (var deviceId in deviceIds)
        {
            devices.Add(await _deviceRepo.GetDeviceByIdAsync(deviceId));
        }

        return devices;
    }
}