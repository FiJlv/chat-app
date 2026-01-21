namespace ChatApp.Application.DTOs;

public class ChatDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? LastMessage { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
    public bool IsFavorite { get; set; }
    public bool IsPinned { get; set; }
    public List<UserDto> Members { get; set; } = new List<UserDto>();
}
