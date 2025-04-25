import { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Send } from 'lucide-react';

const ChatInput: React.FC = () => {
  const { addMessage } = useChatContext();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      addMessage(message.trim(), 'user');
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white border-t border-green-100 p-3"
    >
      <div className="relative flex items-end bg-green-50 rounded-lg border border-green-200 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-200 transition-all">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your health concern..."
          className="flex-1 bg-transparent py-3 pl-4 pr-12 outline-none resize-none max-h-32 text-green-900"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button 
          type="submit"
          className={`absolute right-2 bottom-2.5 p-1.5 rounded-full transition-all ${
            message.trim() 
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-green-200 text-green-500 cursor-not-allowed'
          }`}
          disabled={!message.trim()}
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-xs text-green-600 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
};

export default ChatInput;