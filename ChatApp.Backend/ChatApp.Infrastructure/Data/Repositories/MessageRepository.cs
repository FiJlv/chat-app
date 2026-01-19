using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Data.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly ApplicationDbContext _context;

    public MessageRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Message>> GetByChatIdAsync(int chatId)
    {
        return await _context.Messages
            .Include(m => m.User)
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task<Message> CreateAsync(Message message)
    {
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task<Message?> GetLastMessageAsync(int chatId)
    {
        return await _context.Messages
            .Include(m => m.User)
            .Where(m => m.ChatId == chatId)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync();
    }
}
