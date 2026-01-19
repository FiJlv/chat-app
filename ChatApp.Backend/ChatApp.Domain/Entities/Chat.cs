using ChatApp.Domain.Enums;

namespace ChatApp.Domain.Entities;

public class Chat
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ChatType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public ICollection<ChatMember> Members { get; set; } = new List<ChatMember>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
