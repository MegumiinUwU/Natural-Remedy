import React, { useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Menu, Leaf } from 'lucide-react';
import UserMenu from './UserMenu';
import styles from '../../pages/chat/ChatPage.module.css';

const ChatContainer: React.FC = () => {
  const { currentChat, isTyping, toggleSidebar, isSidebarOpen, userMessages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  const renderMessages = () => {
    if (!currentChat?.messages) return [];
  
    const chatMessages = [...currentChat.messages];
    const currentChatUserMessages = userMessages.filter(
      msg =>
        msg.chatId === currentChat.id &&
        !chatMessages.some(savedMsg => savedMsg.id === msg.id)
    );
  
    return [...chatMessages, ...currentChatUserMessages]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };
  

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'rgba(240, 249, 241, 0.5)' }}>
      <div className="bg-white shadow-sm py-3 px-4 flex items-center justify-between" style={{ borderBottom: '1px solid #dcf0df' }}>
        <div className="flex items-center">
          {!isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="p-2 mr-2 rounded-full hover:bg-[#f0f9f1] text-[#0E5E2E] transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#0E5E2E' }}>
              <Leaf size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg" style={{ color: '#0E5E2E' }}>Natural Remedy Finder</h1>
              <p className="text-xs" style={{ color: '#2e8b57' }}>Holistic wellness solutions</p>
            </div>
          </div>
        </div>
        <UserMenu />
      </div>
      
      <div className={`flex-1 overflow-y-auto p-4 ${styles.customScrollbar}`} style={{ display: 'flex', flexDirection: 'column' }}>
        {(!currentChat?.messages || currentChat.messages.length === 0) && !userMessages.some(msg => msg.chatId === currentChat?.id) ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f0f9f1' }}>
              <Leaf size={32} style={{ color: '#0E5E2E' }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#0E5E2E' }}>Welcome to Natural Remedy Finder</h2>
            <p className="mb-4 max-w-md" style={{ color: '#2e8b57' }}>
              Describe your health concerns or wellness goals, and I'll suggest natural, holistic solutions to help you feel better.
            </p>
            <div className="bg-white p-3 rounded-lg text-sm max-w-sm" style={{ border: '1px solid #dcf0df', color: '#0E5E2E' }}>
              <p className="font-medium mb-1">Try asking about:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Natural remedies for headaches</li>
                <li>Herbs that can help with sleep</li>
                <li>Holistic approaches to reduce stress</li>
                <li>Natural ways to boost immunity</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1">
              {renderMessages().map((message) => (
                <div key={message.id} className="mb-4 last:mb-2">
                  <ChatMessage message={message} />
                </div>
              ))}
            </div>
            
            {isTyping && (
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: '#0E5E2E' }}>
                  <Leaf size={16} className="text-white" />
                </div>
                <div className="py-3 px-4 rounded-lg rounded-tl-none" style={{ backgroundColor: '#f0f9f1', border: '1px solid #dcf0df', color: '#0E5E2E' }}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#0E5E2E', animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#0E5E2E', animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#0E5E2E', animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput />
    </div>
  );
};

export default ChatContainer;