namespace ChatApp.Application.DTOs;

public class CreateChatDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public List<int> UserIds { get; set; } = new List<int>();
}
