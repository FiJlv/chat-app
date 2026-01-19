using ChatApp.Domain.Enums;

namespace ChatApp.Domain.Entities;

public class Message
{
    public int Id { get; set; }
    public int ChatId { get; set; }
    public int? UserId { get; set; } // null for system messages
    public string Content { get; set; } = string.Empty;
    public MessageType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public Chat Chat { get; set; } = null!;
    public User? User { get; set; }
}
