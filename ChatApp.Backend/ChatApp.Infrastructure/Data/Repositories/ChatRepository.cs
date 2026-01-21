using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Data.Repositories;

public class ChatRepository : IChatRepository
{
    private readonly ApplicationDbContext _context;

    public ChatRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Chat>> GetAllAsync(int userId, ChatType? type = null, string? search = null, bool? favorites = null)
    {
        var query = _context.Chats
            .Include(c => c.Members)
                .ThenInclude(m => m.User)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
            .Where(c => c.Members.Any(m => m.UserId == userId))
            .AsQueryable();

        if (type.HasValue)
        {
            query = query.Where(c => c.Type == type.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(c => c.Name.Contains(search));
        }

        if (favorites.HasValue && favorites.Value)
        {
            query = query.Where(c => c.Members.Any(m => m.UserId == userId && m.IsFavorite));
        }

        return await query
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Chat?> GetByIdAsync(int id)
    {
        return await _context.Chats
            .Include(c => c.Members)
                .ThenInclude(m => m.User)
            .Include(c => c.Messages.OrderBy(m => m.CreatedAt))
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Chat>> GetByUserIdAsync(int userId)
    {
        return await _context.Chats
            .Include(c => c.Members)
                .ThenInclude(m => m.User)
            .Where(c => c.Members.Any(m => m.UserId == userId))
            .ToListAsync();
    }

    public async Task<Chat> CreateAsync(Chat chat)
    {
        _context.Chats.Add(chat);
        await _context.SaveChangesAsync();
        return chat;
    }

    public async Task<Chat> UpdateAsync(Chat chat)
    {
        _context.Chats.Update(chat);
        await _context.SaveChangesAsync();
        return chat;
    }

    public async Task<Message?> GetLastMessageAsync(int chatId)
    {
        return await _context.Messages
            .Include(m => m.User)
            .Where(m => m.ChatId == chatId)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateFavoriteStatusAsync(int chatId, int userId, bool isFavorite)
    {
        var member = await _context.ChatMembers
            .FirstOrDefaultAsync(m => m.ChatId == chatId && m.UserId == userId);
        
        if (member == null)
        {
            return false;
        }

        member.IsFavorite = isFavorite;
        await _context.SaveChangesAsync();
        return true;
    }
}
