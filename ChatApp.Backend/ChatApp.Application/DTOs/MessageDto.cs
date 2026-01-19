namespace ChatApp.Application.DTOs;

public class MessageDto
{
    public int Id { get; set; }
    public int ChatId { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserAvatarUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsMine { get; set; }
}
