using DeviceMicroservice.Models;
using DeviceMicroservice.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeviceMicroservice.Controllers;

[ApiController]
[Route("[controller]")]
public class DeviceController : ControllerBase
{
    private readonly DeviceService _deviceService;
    private readonly MappingService _mappingService;    
    
    public DeviceController(DeviceService deviceService, MappingService mappingService)
    {
        _deviceService = deviceService;
        _mappingService = mappingService;
    }
    
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAllDevices()
    {
        return Ok(_deviceService.GetAllDevices().Result);
    }
    
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetDeviceById([FromRoute] Guid id)
    {
        return Ok(_deviceService.GetDeviceByIdAsync(id).Result);
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateDevice([FromBody] Device device)
    {
        return Ok(_deviceService.CreateDevice(device).Result);
    }
    
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateDevice([FromBody] Device device)
    {
        _deviceService.UpdateDevice(device).Wait();
        return  Ok();
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDevice([FromRoute] Guid id)
    {
        await _mappingService.DeleteMappingByDevice(id);
        _deviceService.DeleteDevice(id).Wait();
        return  Ok();
    }
    
    [HttpGet("byUser/{userId}")]
    public IActionResult GetDevicesByUserId([FromRoute] Guid userId)
    {
        return Ok(_deviceService.GetDevicesByUserId(userId).Result);
    }
}