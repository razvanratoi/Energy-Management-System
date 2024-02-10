using System.ComponentModel.DataAnnotations;

namespace UsersMicroservice.Models;

public class User
{
    public User(Guid id, string name, string address, string role, string username, string password)
    {
        Id = id;
        Name = name;
        Address = address;
        Role = role;
        Username = username;
        Password = password;
    }

    [Key]
    public Guid Id { get; set; } = Guid.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Salt { get; set; } = string.Empty;
}