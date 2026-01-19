using AutoMapper;
using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();

        CreateMap<Chat, ChatDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Members, opt => opt.MapFrom(src => src.Members.Select(m => m.User)))
            .ForMember(dest => dest.IsFavorite, opt => opt.Ignore())
            .ForMember(dest => dest.IsPinned, opt => opt.Ignore())
            .ForMember(dest => dest.UnreadCount, opt => opt.Ignore())
            .ForMember(dest => dest.LastMessage, opt => opt.Ignore())
            .ForMember(dest => dest.LastMessageAt, opt => opt.MapFrom(src => src.LastMessageAt));

        CreateMap<Message, MessageDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.Name : null))
            .ForMember(dest => dest.UserAvatarUrl, opt => opt.MapFrom(src => src.User != null ? src.User.AvatarUrl : null))
            .ForMember(dest => dest.IsMine, opt => opt.Ignore());
    }
}
