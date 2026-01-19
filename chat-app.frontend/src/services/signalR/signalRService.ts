import * as signalR from '@microsoft/signalr';
import { SIGNALR_HUB_URL } from '../../utils/constants';
import type { MessageDto } from '../../types/message.types';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;

  async start(): Promise<void> {
    if (this.connection && this.isConnected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL)
      .withAutomaticReconnect()
      .build();

    this.connection.onclose(() => {
      this.isConnected = false;
      console.log('SignalR connection closed');
    });

    this.connection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.connection.onreconnected(() => {
      this.isConnected = true;
      console.log('SignalR reconnected');
    });

    try {
      await this.connection.start();
      this.isConnected = true;
      console.log('SignalR connected');
    } catch (error) {
      console.error('SignalR connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.isConnected = false;
      console.log('SignalR disconnected');
    }
  }

  async joinChat(chatId: number): Promise<void> {
    if (!this.connection || !this.isConnected) {
      await this.start();
    }

    if (this.connection) {
      await this.connection.invoke('JoinChat', chatId);
      console.log(`Joined chat ${chatId}`);
    }
  }

  async leaveChat(chatId: number): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('LeaveChat', chatId);
      console.log(`Left chat ${chatId}`);
    }
  }

  onMessageReceived(callback: (chatId: number, message: MessageDto) => void): void {
    if (this.connection) {
      this.connection.on('MessageReceived', (data: { chatId: number; message: MessageDto }) => {
        callback(data.chatId, data.message);
      });
    }
  }

  onChatUpdated(
    callback: (chatId: number, lastMessage: string, lastMessageAt: string) => void
  ): void {
    if (this.connection) {
      this.connection.on(
        'ChatUpdated',
        (data: { chatId: number; lastMessage: string; lastMessageAt: string }) => {
          callback(data.chatId, data.lastMessage, data.lastMessageAt);
        }
      );
    }
  }

  offMessageReceived(): void {
    if (this.connection) {
      this.connection.off('MessageReceived');
    }
  }

  offChatUpdated(): void {
    if (this.connection) {
      this.connection.off('ChatUpdated');
    }
  }

  getConnectionState(): boolean {
    return this.isConnected;
  }
}

export const signalRService = new SignalRService();
