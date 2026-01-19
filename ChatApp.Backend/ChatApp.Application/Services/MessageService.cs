using AutoMapper;
using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Application.Interfaces.Services;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enums;

namespace ChatApp.Application.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;
    private readonly IChatRepository _chatRepository;
    private readonly IMapper _mapper;

    public MessageService(
        IMessageRepository messageRepository,
        IChatRepository chatRepository,
        IMapper mapper)
    {
        _messageRepository = messageRepository;
        _chatRepository = chatRepository;
        _mapper = mapper;
    }

    public async Task<List<MessageDto>> GetMessagesAsync(int chatId, int userId)
    {
        var chat = await _chatRepository.GetByIdAsync(chatId);
        if (chat == null || !chat.Members.Any(m => m.UserId == userId))
        {
            return new List<MessageDto>();
        }

        var messages = await _messageRepository.GetByChatIdAsync(chatId);

        var messageDtos = messages.Select(message =>
        {
            var messageDto = _mapper.Map<MessageDto>(message);
            messageDto.IsMine = message.UserId == userId;
            return messageDto;
        }).ToList();

        return messageDtos;
    }

    public async Task<MessageDto> SendMessageAsync(SendMessageDto dto, int userId)
    {
        var chat = await _chatRepository.GetByIdAsync(dto.ChatId);
        if (chat == null)
        {
            throw new ArgumentException($"Chat with id {dto.ChatId} not found");
        }

        if (!chat.Members.Any(m => m.UserId == userId))
        {
            throw new UnauthorizedAccessException($"User {userId} is not a member of chat {dto.ChatId}");
        }

        var message = new Message
        {
            ChatId = dto.ChatId,
            UserId = userId,
            Content = dto.Content,
            Type = MessageType.Text,
            CreatedAt = DateTime.UtcNow
        };

        var createdMessage = await _messageRepository.CreateAsync(message);

        chat.LastMessageAt = DateTime.UtcNow;
        chat.UpdatedAt = DateTime.UtcNow;
        await _chatRepository.UpdateAsync(chat);

        var messageDto = _mapper.Map<MessageDto>(createdMessage);
        messageDto.IsMine = true;

        return messageDto;
    }
}
