using ChatApp.Domain.Entities;
using ChatApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Data.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.EnsureCreatedAsync();
        if (await context.Users.AnyAsync())
        {
            return;
        }

        var users = new List<User>
        {
            new User { Name = "John Doe", Email = "john@example.com", AvatarUrl = "https://i.pravatar.cc/150?img=1" },
            new User { Name = "Jane Smith", Email = "jane@example.com", AvatarUrl = "https://i.pravatar.cc/150?img=2" },
            new User { Name = "Bob Johnson", Email = "bob@example.com", AvatarUrl = "https://i.pravatar.cc/150?img=3" },
            new User { Name = "Alice Williams", Email = "alice@example.com", AvatarUrl = "https://i.pravatar.cc/150?img=4" },
            new User { Name = "Charlie Brown", Email = "charlie@example.com", AvatarUrl = "https://i.pravatar.cc/150?img=5" },
            new User { Name = "Diana Prince", Email = "diana@example.com", AvatarUrl = "https://i.pravatar.cc/150?img=6" },
            new User { Name = "Eve Davis", Email = "eve@example.com", AvatarUrl = "https://i.pravatar.cc/150?img=7" }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        var groupChat1 = new Chat
        {
            Name = "Somnium Global",
            Type = ChatType.Group,
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            UpdatedAt = DateTime.UtcNow.AddDays(-1),
            LastMessageAt = DateTime.UtcNow.AddHours(-2)
        };

        var groupChat2 = new Chat
        {
            Name = "Group Chat 01",
            Type = ChatType.Group,
            CreatedAt = DateTime.UtcNow.AddDays(-20),
            UpdatedAt = DateTime.UtcNow.AddHours(-5),
            LastMessageAt = DateTime.UtcNow.AddHours(-5)
        };

        var groupChat3 = new Chat
        {
            Name = "Group Chat 02",
            Type = ChatType.Group,
            CreatedAt = DateTime.UtcNow.AddDays(-15),
            UpdatedAt = DateTime.UtcNow.AddMinutes(-30),
            LastMessageAt = DateTime.UtcNow.AddMinutes(-30)
        };

        var groupChat4 = new Chat
        {
            Name = "Team Project",
            Type = ChatType.Group,
            CreatedAt = DateTime.UtcNow.AddDays(-10),
            UpdatedAt = DateTime.UtcNow.AddHours(-1),
            LastMessageAt = DateTime.UtcNow.AddHours(-1)
        };
        
        var privateChat1 = new Chat
        {
            Name = "Secret Chat 1",
            Type = ChatType.Private,
            CreatedAt = DateTime.UtcNow.AddDays(-25),
            UpdatedAt = DateTime.UtcNow.AddHours(-3),
            LastMessageAt = DateTime.UtcNow.AddHours(-3)
        };

        var privateChat2 = new Chat
        {
            Name = "Secret Chat 2",
            Type = ChatType.Private,
            CreatedAt = DateTime.UtcNow.AddDays(-12),
            UpdatedAt = DateTime.UtcNow.AddHours(-8),
            LastMessageAt = DateTime.UtcNow.AddHours(-8)
        };

        await context.Chats.AddRangeAsync(groupChat1, groupChat2, groupChat3, groupChat4, privateChat1, privateChat2);
        await context.SaveChangesAsync();

        var groupChat1Members = users.Select((user, index) => new ChatMember
        {
            ChatId = groupChat1.Id,
            UserId = user.Id,
            Role = index == 0 ? ChatMemberRole.Admin : ChatMemberRole.Member,
            JoinedAt = groupChat1.CreatedAt,
            IsFavorite = user.Id == users[0].Id 
        }).ToList();

        var groupChat2Members = users.Take(4).Select((user, index) => new ChatMember
        {
            ChatId = groupChat2.Id,
            UserId = user.Id,
            Role = index == 0 ? ChatMemberRole.Admin : ChatMemberRole.Member,
            JoinedAt = groupChat2.CreatedAt,
            IsFavorite = false
        }).ToList();
        var groupChat3Indices = new[] { 0, 2, 3, 4 };
        var groupChat3Members = groupChat3Indices.Select((originalIndex, position) => new ChatMember
        {
            ChatId = groupChat3.Id,
            UserId = users[originalIndex].Id,
            Role = position == 0 ? ChatMemberRole.Admin : ChatMemberRole.Member,
            JoinedAt = groupChat3.CreatedAt,
            IsFavorite = false
        }).ToList();

        var groupChat4Members = users.Take(5).Select((user, index) => new ChatMember
        {
            ChatId = groupChat4.Id,
            UserId = user.Id,
            Role = index == 0 ? ChatMemberRole.Admin : ChatMemberRole.Member,
            JoinedAt = groupChat4.CreatedAt,
            IsFavorite = false
        }).ToList();

        var privateChat1Indices = new[] { 0, 5 };
        var privateChat1Members = privateChat1Indices.Select(index => new ChatMember
        {
            ChatId = privateChat1.Id,
            UserId = users[index].Id,
            Role = ChatMemberRole.Member,
            JoinedAt = privateChat1.CreatedAt,
            IsFavorite = false
        }).ToList();

        var privateChat2Indices = new[] { 0, 6 };
        var privateChat2Members = privateChat2Indices.Select(index => new ChatMember
        {
            ChatId = privateChat2.Id,
            UserId = users[index].Id,
            Role = ChatMemberRole.Member,
            JoinedAt = privateChat2.CreatedAt,
            IsFavorite = false
        }).ToList();

        await context.ChatMembers.AddRangeAsync(groupChat1Members);
        await context.ChatMembers.AddRangeAsync(groupChat2Members);
        await context.ChatMembers.AddRangeAsync(groupChat3Members);
        await context.ChatMembers.AddRangeAsync(groupChat4Members);
        await context.ChatMembers.AddRangeAsync(privateChat1Members);
        await context.ChatMembers.AddRangeAsync(privateChat2Members);
        await context.SaveChangesAsync();

        var groupChat1Messages = CreateMessagesForChat(groupChat1.Id, users, 12);
        await context.Messages.AddRangeAsync(groupChat1Messages);

        var groupChat2Messages = CreateMessagesForChat(groupChat2.Id, users.Take(4).ToList(), 10);
        await context.Messages.AddRangeAsync(groupChat2Messages);

        var groupChat3Users = new List<User> { users[0], users[2], users[3], users[4] };
        var groupChat3Messages = CreateMessagesForChat(groupChat3.Id, groupChat3Users, 15);
        await context.Messages.AddRangeAsync(groupChat3Messages);

        var groupChat4Messages = CreateMessagesForChat(groupChat4.Id, users.Take(5).ToList(), 11);
        await context.Messages.AddRangeAsync(groupChat4Messages);

        var privateChat1Users = new List<User> { users[0], users[5] };
        var privateChat1Messages = CreateMessagesForChat(privateChat1.Id, privateChat1Users, 8);
        await context.Messages.AddRangeAsync(privateChat1Messages);

        var privateChat2Users = new List<User> { users[0], users[6] };
        var privateChat2Messages = CreateMessagesForChat(privateChat2.Id, privateChat2Users, 9);
        await context.Messages.AddRangeAsync(privateChat2Messages);

        await context.SaveChangesAsync();
    }

    private static List<Message> CreateMessagesForChat(int chatId, List<User> participants, int messageCount)
    {
        var messages = new List<Message>();
        var baseTime = DateTime.UtcNow.AddHours(-24);
        var random = new Random();

        messages.Add(new Message
        {
            ChatId = chatId,
            UserId = null,
            Content = $"{participants[0].Name} added you to this chat",
            Type = MessageType.System,
            CreatedAt = baseTime
        });

        var messageTexts = new[]
        {
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
            "Ut enim ad minim veniam",
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
            "Hello everyone!",
            "How are you doing?",
            "Great to be here!",
            "Thanks for adding me to this chat."
        };

        for (int i = 0; i < messageCount - 1; i++)
        {
            var user = participants[random.Next(participants.Count)];
            var messageText = messageTexts[random.Next(messageTexts.Length)];
            
            messages.Add(new Message
            {
                ChatId = chatId,
                UserId = user.Id,
                Content = messageText,
                Type = MessageType.Text,
                CreatedAt = baseTime.AddMinutes(i * 30 + random.Next(10, 20))
            });
        }

        return messages.OrderBy(m => m.CreatedAt).ToList();
    }
}
