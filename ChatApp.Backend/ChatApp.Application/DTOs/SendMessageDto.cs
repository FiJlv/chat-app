namespace ChatApp.Application.DTOs;

public class SendMessageDto
{
    public int ChatId { get; set; }
    public string Content { get; set; } = string.Empty;
}
