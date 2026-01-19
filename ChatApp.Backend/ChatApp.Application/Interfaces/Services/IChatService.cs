using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Services;

public interface IChatService
{
    Task<List<ChatDto>> GetChatsAsync(int userId, string? type = null, string? search = null, bool? favorites = null);
    Task<ChatDto?> GetChatByIdAsync(int id, int userId);
    Task<ChatDto> CreateChatAsync(CreateChatDto dto, int creatorId);
}
