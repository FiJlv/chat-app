using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Services;

public interface IUserService
{
    Task<UserDto?> GetCurrentUserAsync();
    Task<UserDto?> GetUserByIdAsync(int id);
}
