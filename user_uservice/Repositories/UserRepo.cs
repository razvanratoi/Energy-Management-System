using Microsoft.EntityFrameworkCore;
using UsersMicroservice.Data;
using UsersMicroservice.Models;

namespace UsersMicroservice.Repositories;

public class UserRepo
{
    private readonly UsersDbContext _context;

    public UserRepo(UsersDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.User.ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _context.User.SingleOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> CreateUserAsync(User user)
    {
        user.Id = Guid.NewGuid();
        await _context.User.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateUserAsync(User user)
    {
        _context.User.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(Guid id)
    {
        var user = await GetUserByIdAsync(id);
        if (user == null) throw new Exception("User not found");
        _context.User.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User> FindByUsername(string username)
    {
        var user = await _context.User.SingleOrDefaultAsync(u => u.Username == username);
        if (user == null) throw new Exception("Invalid credentials");

        return user;
    }
}