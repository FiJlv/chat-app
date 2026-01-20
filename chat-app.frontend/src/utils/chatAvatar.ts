import type { ChatDto } from '../types/chat.types';
import type { UserDto } from '../types/user.types';

//TODO: Replace with proper group chat avatar when implemented

export const getChatAvatarMember = (chat: ChatDto, currentUser: UserDto | null) => {
  if (!currentUser) {
    return chat.members[0] || null;
  }

  const otherMembers = chat.members.filter((member) => member.id !== currentUser.id);

  if (otherMembers.length > 0) {
    const memberIndex = chat.type === 'Group' ? (chat.id % otherMembers.length) : 0;
    return otherMembers[memberIndex];
  }

  return chat.members[0] || null;
};
