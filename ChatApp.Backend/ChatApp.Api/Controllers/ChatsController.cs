using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatsController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly IUserService _userService;

    public ChatsController(IChatService chatService, IUserService userService)
    {
        _chatService = chatService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetChats(
        [FromQuery] string? type = null,
        [FromQuery] string? search = null,
        [FromQuery] bool? favorites = null)
    {
        var currentUser = await _userService.GetCurrentUserAsync();
        if (currentUser == null)
        {
            return Unauthorized("User not found");
        }

        var chats = await _chatService.GetChatsAsync(currentUser.Id, type, search, favorites);
        return Ok(chats);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetChatById(int id)
    {
        var currentUser = await _userService.GetCurrentUserAsync();
        if (currentUser == null)
        {
            return Unauthorized("User not found");
        }

        var chat = await _chatService.GetChatByIdAsync(id, currentUser.Id);
        if (chat == null)
        {
            return NotFound($"Chat with id {id} not found or access denied");
        }

        return Ok(chat);
    }

    [HttpPost]
    public async Task<IActionResult> CreateChat([FromBody] CreateChatDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var currentUser = await _userService.GetCurrentUserAsync();
        if (currentUser == null)
        {
            return Unauthorized("User not found");
        }

        try
        {
            var chat = await _chatService.CreateChatAsync(dto, currentUser.Id);
            return CreatedAtAction(nameof(GetChatById), new { id = chat.Id }, chat);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
