using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Infrastructure.Services;

public class ChatHub : Hub
{
    public async Task JoinChat(int chatId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"chat_{chatId}");
    }

    public async Task LeaveChat(int chatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"chat_{chatId}");
    }
}
