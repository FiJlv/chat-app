using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users
            .OrderBy(u => u.Name)
            .ToListAsync();
    }

    public async Task<User?> GetCurrentUserAsync()
    {
        return await _context.Users
            .OrderBy(u => u.Id)
            .FirstOrDefaultAsync();
    }
}
