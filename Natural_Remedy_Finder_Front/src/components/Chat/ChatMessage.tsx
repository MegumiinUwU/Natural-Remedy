import { Leaf } from 'lucide-react';
interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }
interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div 
      className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
      style={{
        animationDuration: '0.3s'
      }}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center mr-2 flex-shrink-0">
          <Leaf size={16} className="text-white" />
        </div>
      )}
      
      <div
        className={`relative px-4 py-3 rounded-lg max-w-[50%] ${
          isUser 
            ? 'bg-green-600 text-white rounded-tr-none' 
            : 'bg-green-50 text-green-900 rounded-tl-none border border-green-100'
        }`}
      >
        <div className="text-sm">
          {message.content}
        </div>
        <div 
          className={`text-[10px] mt-1 text-right ${
            isUser ? 'text-green-100' : 'text-green-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center ml-2 text-white flex-shrink-0">
          {message.sender === 'user' && (
            <span className="text-sm font-medium">You</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;