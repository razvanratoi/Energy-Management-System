namespace UsersMicroservice.DTOs;

public class UserDTO
{
    public Guid Id { get; set; } = Guid.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    
    public UserDTO(Guid id, string name, string address, string role)
    {
        Id = id;
        Name = name;
        Address = address;
        Role = role;
    }
}