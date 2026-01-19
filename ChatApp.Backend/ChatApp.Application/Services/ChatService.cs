using AutoMapper;
using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Application.Interfaces.Services;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enums;

namespace ChatApp.Application.Services;

public class ChatService : IChatService
{
    private readonly IChatRepository _chatRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IMapper _mapper;

    public ChatService(
        IChatRepository chatRepository,
        IUserRepository userRepository,
        IMessageRepository messageRepository,
        IMapper mapper)
    {
        _chatRepository = chatRepository;
        _userRepository = userRepository;
        _messageRepository = messageRepository;
        _mapper = mapper;
    }

    public async Task<List<ChatDto>> GetChatsAsync(int userId, string? type = null, string? search = null, bool? favorites = null)
    {
        ChatType? chatType = null;
        if (!string.IsNullOrWhiteSpace(type) && Enum.TryParse<ChatType>(type, true, out var parsedType))
        {
            chatType = parsedType;
        }

        var chats = await _chatRepository.GetAllAsync(userId, chatType, search, favorites);

        var chatDtos = new List<ChatDto>();

        foreach (var chat in chats)
        {
            var chatDto = _mapper.Map<ChatDto>(chat);

            var lastMessage = await _messageRepository.GetLastMessageAsync(chat.Id);
            if (lastMessage != null)
            {
                chatDto.LastMessage = lastMessage.Content;
                chatDto.LastMessageAt = lastMessage.CreatedAt;
            }

            var userMember = chat.Members.FirstOrDefault(m => m.UserId == userId);
            if (userMember != null)
            {
                chatDto.IsFavorite = userMember.IsFavorite;
            }

            // TODO: unread count
            chatDto.UnreadCount = 0;

            chatDtos.Add(chatDto);
        }

        return chatDtos;
    }

    public async Task<ChatDto?> GetChatByIdAsync(int id, int userId)
    {
        var chat = await _chatRepository.GetByIdAsync(id);
        if (chat == null)
        {
            return null;
        }

        if (!chat.Members.Any(m => m.UserId == userId))
        {
            return null;
        }

        var chatDto = _mapper.Map<ChatDto>(chat);

        var lastMessage = await _messageRepository.GetLastMessageAsync(chat.Id);
        if (lastMessage != null)
        {
            chatDto.LastMessage = lastMessage.Content;
            chatDto.LastMessageAt = lastMessage.CreatedAt;
        }

        var userMember = chat.Members.FirstOrDefault(m => m.UserId == userId);
        if (userMember != null)
        {
            chatDto.IsFavorite = userMember.IsFavorite;
        }

        // TODO: unread count
        chatDto.UnreadCount = 0;

        return chatDto;
    }

    public async Task<ChatDto> CreateChatAsync(CreateChatDto dto, int creatorId)
    {
        if (!Enum.TryParse<ChatType>(dto.Type, true, out var chatType))
        {
            throw new ArgumentException($"Invalid chat type: {dto.Type}");
        }

        var userIds = new List<int> { creatorId };
        userIds.AddRange(dto.UserIds);

        foreach (var userId in userIds.Distinct())
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException($"User with id {userId} not found");
            }
        }

        var chat = new Chat
        {
            Name = dto.Name,
            Type = chatType,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdChat = await _chatRepository.CreateAsync(chat);

        var members = userIds.Distinct().Select((userId, index) => new ChatMember
        {
            ChatId = createdChat.Id,
            UserId = userId,
            Role = userId == creatorId ? ChatMemberRole.Admin : ChatMemberRole.Member,
            JoinedAt = DateTime.UtcNow,
            IsFavorite = false
        }).ToList();

        createdChat.Members = members;
        await _chatRepository.UpdateAsync(createdChat);

        var chatWithMembers = await _chatRepository.GetByIdAsync(createdChat.Id);
        if (chatWithMembers == null)
        {
            throw new InvalidOperationException("Failed to retrieve created chat");
        }

        var chatDto = _mapper.Map<ChatDto>(chatWithMembers);
        chatDto.IsFavorite = false;
        chatDto.UnreadCount = 0;

        return chatDto;
    }
}
