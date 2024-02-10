using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using UsersMicroservice.Models;
using UsersMicroservice.Services;

namespace UsersMicroservice.Controllers;

[DisableCors]
[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }


    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetUsers()
    {
        var users = _userService.GetAllUsers();

        if (users == null)
        {
            return BadRequest();
        }
        return Ok(users.Result);
    }

    [HttpGet("{id}")]
    public IActionResult GetUser([FromRoute] Guid id)
    {
        var user = _userService.GetUserById(id).Result;
        return Ok(user);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateUser([FromBody] User user)
    {
        var createdUser =  _userService.CreateUser(user).Result;
        return Ok(createdUser);
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser([FromBody] User user)
    {
        var returned = await _userService.UpdateUser(user);
        return Ok(returned);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
    {
        var response = await _userService.DeleteUser(HttpContext, id);
        return response ? Ok() : BadRequest("Problem deleting corresponding mappings");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] Credentials credentials)
    {
        var token = _userService.Login(credentials.Username, credentials.Password);
        return Ok(token.Result);
    }

    [HttpGet("fromToken")]
    public IActionResult getUserFromToken()
    {
        var user = _userService.GetUserFromToken(HttpContext).Result;

        if (user == null)
            return Unauthorized();
        return Ok(user);
    }
    
    [HttpGet("idFromToken")]
    public IActionResult GetUserIdFromToken()
    {
        var user = _userService.GetUserFromToken(HttpContext).Result;

        if (user == null)
            return Unauthorized();
        return Ok(user.Id);
    }
    
    [HttpPost("mocks")]
    public IActionResult CreateMockUsers([FromBody] User user)
    {
        var users = _userService.CreateUser(user).Result;
        return Ok(users);
    }
}