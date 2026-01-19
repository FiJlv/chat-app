using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Services;

public interface IMessageService
{
    Task<List<MessageDto>> GetMessagesAsync(int chatId, int userId);
    Task<MessageDto> SendMessageAsync(SendMessageDto dto, int userId);
}
