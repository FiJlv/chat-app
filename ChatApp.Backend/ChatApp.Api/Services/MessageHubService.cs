using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Services;
using ChatApp.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Api.Services;

public class MessageHubService : IMessageHubService
{
    private readonly IHubContext<ChatHub> _hubContext;

    public MessageHubService(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendMessageToChatAsync(int chatId, MessageDto message)
    {
        await _hubContext.Clients.Group($"chat_{chatId}").SendAsync("MessageReceived", new
        {
            ChatId = chatId,
            Message = message
        });
    }

    public async Task NotifyChatUpdatedAsync(int chatId, ChatDto chat)
    {
        await _hubContext.Clients.Group($"chat_{chatId}").SendAsync("ChatUpdated", new
        {
            ChatId = chatId,
            LastMessage = chat.LastMessage,
            LastMessageAt = chat.LastMessageAt
        });
    }
}
