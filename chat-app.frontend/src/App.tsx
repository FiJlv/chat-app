import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ChatList } from './components/ChatList/ChatList';
import { ChatWindow } from './components/ChatWindow/ChatWindow';
import { signalRService } from './services/signalR/signalRService';

function AppContent() {
  useEffect(() => {
    signalRService.start().catch((error) => {
      console.error('Failed to start SignalR:', error);
    });

    return () => {
      signalRService.stop();
    };
  }, []);

  return (
    <div className="app-container">
      <div className="app-sidebar">
        <ChatList />
      </div>
      <div className="app-main">
        <ChatWindow />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
