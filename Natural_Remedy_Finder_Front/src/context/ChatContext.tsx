import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  chatId: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ApiResponse {
  message: string;
  error?: string;
}

interface ChatApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  addMessage: (content: string, sender: 'user' | 'bot') => void;
  createNewChat: () => void;
  deleteChat: (chatId: string) => void;
  isTyping: boolean;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  setApiConfig: (config: ChatApiConfig) => void;
  userMessages: Message[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [apiConfig, setApiConfig] = useState<ChatApiConfig | null>(null);
  const [userMessages, setUserMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0 && !currentChat) {
      setCurrentChat(chats[0]);
    }
  }, [chats, currentChat]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    setUserMessages(prev => prev.filter(msg => msg.chatId !== chatId));
    
    if (currentChat && currentChat.id === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChat(remainingChats[0]);
      } else {
        createNewChat();
      }
    }
  };

  const addMessage = async (content: string, sender: 'user' | 'bot') => {
    if (!currentChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      chatId: currentChat.id
    };

    if (sender === 'user') {
      setUserMessages(prev => [...prev, newMessage]);
    }

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
      title: currentChat.messages.length === 0 && sender === 'user' 
        ? content.slice(0, 30) + (content.length > 30 ? '...' : '') 
        : currentChat.title,
    };

    setCurrentChat(updatedChat);
    setChats(prev => prev.map(chat => 
      chat.id === currentChat.id ? updatedChat : chat
    ));

    if (sender === 'user') {
      if (apiConfig) {
        await sendMessageToBackend(content);
      } else {
        await simulateBotResponse(content);
      }
    }
  };

  const sendMessageToBackend = async (message: string) => {
    if (!apiConfig) return;

    setIsTyping(true);
    
    try {
      const response = await fetch(`${apiConfig.baseUrl}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiConfig.headers,
        },
        body: JSON.stringify({ message }),
      });

      const data: ApiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      await addMessage(data.message, 'bot');
    } catch (error) {
      console.error('Error sending message to backend:', error);
      await addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
    } finally {
      setIsTyping(false);
    }
  };
  
  const simulateBotResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    const responses = [
      {
        keywords: ['headache', 'head', 'pain', 'migraine'],
        response: "For headaches, I recommend trying feverfew herb, which has been traditionally used to treat migraines. Peppermint oil applied to the temples can also provide relief. Staying hydrated and practicing deep breathing exercises might help reduce tension headaches."
      },
      {
        keywords: ['sleep', 'insomnia', 'can\'t sleep', 'tired'],
        response: "To improve sleep quality, consider chamomile or valerian root tea before bedtime. Lavender essential oil in a diffuser can create a calming atmosphere. Establish a regular sleep schedule and avoid screens at least an hour before bed."
      },
      {
        keywords: ['anxiety', 'stress', 'nervous', 'worry'],
        response: "For anxiety and stress, adaptogenic herbs like ashwagandha may help balance stress hormones. L-theanine found in green tea has calming properties. Regular practice of mindfulness meditation for even just 5 minutes daily can significantly reduce anxiety levels."
      },
      {
        keywords: ['cold', 'flu', 'cough', 'fever', 'sick'],
        response: "To address cold and flu symptoms, elderberry syrup has antiviral properties. Ginger tea with honey can soothe a sore throat and cough. Ensure you're getting plenty of vitamin C from citrus fruits and rest adequately to support your immune system."
      },
      {
        keywords: ['stomach', 'digestion', 'nausea', 'bloating', 'digestive'],
        response: "For digestive issues, ginger can help with nausea and general digestive discomfort. Peppermint tea may relieve bloating and gas. Probiotics found in fermented foods like yogurt and sauerkraut support gut health and overall digestion."
      }
    ];
    
    let botResponse = "I understand you're looking for natural remedies. Could you provide more specific details about your health concern? I can suggest herbs, teas, and holistic practices that might help.";
    
    for (const item of responses) {
      if (item.keywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
        botResponse = item.response;
        break;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
    setIsTyping(false);
    await addMessage(botResponse, 'bot');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        setCurrentChat,
        addMessage,
        createNewChat,
        deleteChat,
        isTyping,
        toggleSidebar,
        isSidebarOpen,
        setApiConfig,
        userMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;