export const formatChatTime = (dateString?: string): string => {
  if (!dateString) return '';

  let date: Date;
  if (dateString.endsWith('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
    date = new Date(dateString);
  } else {
    date = new Date(dateString + 'Z');
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatMessageTime = (dateString: string): string => {
  let date: Date;
  if (dateString.endsWith('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
    date = new Date(dateString);
  } else {
    date = new Date(dateString + 'Z');
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
};
