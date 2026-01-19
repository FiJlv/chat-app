using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Services;

public interface IMessageHubService
{
    Task SendMessageToChatAsync(int chatId, MessageDto message);
    Task NotifyChatUpdatedAsync(int chatId, ChatDto chat);
}
