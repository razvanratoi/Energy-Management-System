using System.ComponentModel.DataAnnotations;

namespace DeviceMicroservice.Models;

public class Mapping
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid DeviceId { get; set; }
    
}