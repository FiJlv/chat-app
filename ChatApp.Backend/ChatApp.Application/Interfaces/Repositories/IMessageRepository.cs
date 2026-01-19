using ChatApp.Domain.Entities;

namespace ChatApp.Application.Interfaces.Repositories;

public interface IMessageRepository
{
    Task<List<Message>> GetByChatIdAsync(int chatId);
    Task<Message> CreateAsync(Message message);
    Task<Message?> GetLastMessageAsync(int chatId);
}
