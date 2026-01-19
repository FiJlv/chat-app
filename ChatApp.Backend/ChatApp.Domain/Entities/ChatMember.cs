using ChatApp.Domain.Enums;

namespace ChatApp.Domain.Entities;

public class ChatMember
{
    public int Id { get; set; }
    public int ChatId { get; set; }
    public int UserId { get; set; }
    public ChatMemberRole Role { get; set; }
    public DateTime JoinedAt { get; set; }
    public bool IsFavorite { get; set; }
    public Chat Chat { get; set; } = null!;
    public User User { get; set; } = null!;
}
