using Microsoft.AspNetCore.Mvc;
using MonitoringMicroserviceNET.Services;

namespace MonitoringMicroserviceNET.Controllers;

[ApiController]
[Route("monitoring")]
public class MonitoringController : ControllerBase
{
    private readonly MonitoringService _service;
    
    public MonitoringController(MonitoringService service)
    {
        _service = service;
    }
    
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Monitoring Microservice");
    }
    
    [HttpGet("all")]
    public IActionResult GetAll()
    {
        return Ok(_service.GetAllMonitoringAsync().Result);
    }
    
    [HttpPost]
    public IActionResult GetMonitoringsByDay([FromBody] DateTime date)
    {
        return Ok(_service.GetMonitoringByDay(date).Result);
    }

    [HttpDelete]
    public IActionResult deleteAll()
    {
        return Ok(_service.DeleteAllMonitoring().Result);
    }
}