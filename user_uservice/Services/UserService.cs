using System.Net.Http.Headers;
using UsersMicroservice.DTOs;
using UsersMicroservice.Mappings;
using UsersMicroservice.Models;
using UsersMicroservice.Repositories;

namespace UsersMicroservice.Services;

public class UserService
{
    private readonly Mapper _mapper;
    private readonly PasswordService _passwordService;
    private readonly UserRepo _repo;
    private readonly JwtTokenService _tokenService;

    public UserService(UserRepo repo, Mapper mapper, JwtTokenService tokenService, PasswordService passwordService)
    {
        _repo = repo;
        _mapper = mapper;
        _tokenService = tokenService;
        _passwordService = passwordService;
    }

    public async Task<IEnumerable<UserDTO>> GetAllUsers()
    {
        var users = await _repo.GetAllUsersAsync();
        return _mapper.Map(users);
    }

    public async Task<User> GetUserById(Guid id)
    {
        var user = await _repo.GetUserByIdAsync(id);
        return user;
    }

    public async Task<User> CreateUser(User user)
    {
        user.Salt = _passwordService.GenerateSalt();
        user.Password = _passwordService.HashPassword(user.Password, user.Salt);
        return await _repo.CreateUserAsync(user);
    }

    public async Task<User> UpdateUser(User user)
    {
        var updatedUser = await _repo.GetUserByIdAsync(user.Id);

        if (updatedUser != null)
        {
            updatedUser.Name = user.Name;
            updatedUser.Address = user.Address;
            updatedUser.Role = user.Role;
            if (updatedUser.Password != user.Password)
                updatedUser.Password = _passwordService.HashPassword(user.Password, updatedUser.Salt);
            await _repo.UpdateUserAsync(updatedUser);

            var newlyUpdatedUser = await _repo.GetUserByIdAsync(user.Id);
            return newlyUpdatedUser;
        }

        return null;
    }

    public async Task<bool> DeleteUser(HttpContext context, Guid id)
    {
        
        using (var httpClient = new HttpClient())
        {
            string token = context.Request.Headers["Authorization"]!.ToString().Replace("Bearer ", "");
            Console.WriteLine(token);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
           

            HttpResponseMessage response = await httpClient.DeleteAsync("http://host.docker.internal:5555/mapping/" + id);
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                await _repo.DeleteUserAsync(id);
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    public async Task<Credentials> Login(string username, string password)
    {
        var user = await _repo.FindByUsername(username);
        if (user != null && _passwordService.CheckPassword(password, user.Salt, user.Password))
            return new Credentials(_tokenService.CreateToken(user), user.Role);
        throw new Exception("Invalid username or password");
    }

    public async Task<UserDTO?> GetUserFromToken(HttpContext context)
    {
        var userId = _tokenService.GetUserIdFromToken(context);
        var user = await _repo.GetUserByIdAsync(userId);
        return user == null ? null : _mapper.Map(user);
    }
}