using ChatApp.Domain.Entities;
using ChatApp.Domain.Enums;

namespace ChatApp.Application.Interfaces.Repositories;

public interface IChatRepository
{
    Task<List<Chat>> GetAllAsync(int userId, ChatType? type = null, string? search = null, bool? favorites = null);
    Task<Chat?> GetByIdAsync(int id);
    Task<List<Chat>> GetByUserIdAsync(int userId);
    Task<Chat> CreateAsync(Chat chat);
    Task<Chat> UpdateAsync(Chat chat);
    Task<Message?> GetLastMessageAsync(int chatId);
}
