using AutoMapper;
using UsersMicroservice.DTOs;
using UsersMicroservice.Models;

namespace UsersMicroservice.Mappings;

public class Mapper
{
    public UserDTO Map(User user)
    {
        return new UserDTO(user.Id, user.Name, user.Address, user.Role);
    }
    
    public IEnumerable<UserDTO> Map(IEnumerable<User> users)
    {
        List<UserDTO> userDtos = new List<UserDTO>();
        foreach (var user in users)
        {
            userDtos.Add(Map(user));
        }

        return userDtos;
    }
}