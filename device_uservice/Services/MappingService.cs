using DeviceMicroservice.Models;
using DeviceMicroservice.Repositories;

namespace DeviceMicroservice.Services;

public class MappingService
{
    private readonly MappingRepo _mappingRepo;
    
    public MappingService(MappingRepo mappingRepo)
    {
        _mappingRepo = mappingRepo;
    }
    
    public async Task<IEnumerable<Mapping>> GetAllMappings()
    {
        return await _mappingRepo.GetAllMappingsAsync();
    }
    
    public async Task<Mapping> CreateMapping(Mapping mapping)
    {
        mapping.Id = new Guid();
        return await _mappingRepo.CreateMappingAsync(mapping);
    }
    
    public async Task DeleteMappingByUser(Guid userId)
    {
        var mappings = _mappingRepo.GetMappingsByUser(userId).Result;
        await _mappingRepo.DeleteMappings(mappings);
    }

    public async Task DeleteMappingByDevice(Guid deviceId)
    {
        var mappings = _mappingRepo.GetMappingsByDevice(deviceId).Result;
        await _mappingRepo.DeleteMappings(mappings);
    }
}