using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/chats/{chatId}/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IUserService _userService;

    public MessagesController(IMessageService messageService, IUserService userService)
    {
        _messageService = messageService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages(int chatId)
    {
        var currentUser = await _userService.GetCurrentUserAsync();
        if (currentUser == null)
        {
            return Unauthorized("User not found");
        }

        var messages = await _messageService.GetMessagesAsync(chatId, currentUser.Id);
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage(int chatId, [FromBody] SendMessageDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (dto.ChatId != chatId)
        {
            return BadRequest("ChatId in body must match route parameter");
        }

        var currentUser = await _userService.GetCurrentUserAsync();
        if (currentUser == null)
        {
            return Unauthorized("User not found");
        }

        try
        {
            var message = await _messageService.SendMessageAsync(dto, currentUser.Id);
            return Ok(message);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }
}
