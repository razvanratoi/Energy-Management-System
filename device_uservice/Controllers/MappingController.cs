using DeviceMicroservice.Models;
using DeviceMicroservice.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeviceMicroservice.Controllers;

[ApiController]
[Route("[controller]")]
public class MappingController : ControllerBase
{
    private readonly MappingService _mappingService;
    
    public MappingController(MappingService mappingService)
    {
        _mappingService = mappingService;
    }
    
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAllMappings()
    {
        return Ok(_mappingService.GetAllMappings().Result);
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateMapping([FromBody] Mapping mapping)
    {
        return Ok(_mappingService.CreateMapping(mapping).Result);
    }
    
    [HttpDelete("{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteMapping([FromRoute] Guid userId)
    {
        await _mappingService.DeleteMappingByUser(userId);
        return Ok();
    }
}