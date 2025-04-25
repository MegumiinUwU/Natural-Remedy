import { useChatContext } from '../context/ChatContext';
import { MessageSquarePlus, ChevronLeft, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const Sidebar: React.FC = () => {
  const { 
    chats, 
    currentChat, 
    setCurrentChat, 
    createNewChat,
    deleteChat, 
    isSidebarOpen,
    toggleSidebar
  } = useChatContext();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setShowDeleteConfirm(chatId);
  };

  const confirmDelete = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
    setShowDeleteConfirm(null);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  return (
    <div 
      className={`bg-white border-r border-green-100 h-full flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-80' : 'w-0'
      }`}
    >
      {isSidebarOpen && (
        <>
          <div className="flex items-center justify-between p-4 border-b border-green-100">
            <h2 className="text-xl font-semibold text-green-800">Chat History</h2>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-green-50 text-green-700 transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          
          <div className="p-3">
            <button 
              onClick={createNewChat}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              <MessageSquarePlus size={20} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {chats.map((chat) => {
              const date = new Date(chat.createdAt);
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(date);
              
              const isSelected = currentChat?.id === chat.id;
              const isConfirmingDelete = showDeleteConfirm === chat.id;
              
              return (
                <div 
                  key={chat.id}
                  className={`relative border-b border-green-50 ${
                    isSelected ? 'bg-green-100/70' : 'hover:bg-green-50'
                  } transition-all duration-200`}
                >
                  {isConfirmingDelete ? (
                    <div className="p-3 bg-red-50 flex items-center justify-between animate-fadeIn">
                      <p className="text-sm text-red-700">Delete this chat?</p>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => confirmDelete(e, chat.id)}
                          className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={cancelDelete}
                          className="p-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <button 
                        onClick={() => setCurrentChat(chat)}
                        className="flex-1 text-left p-3"
                      >
                        <div className="font-medium text-green-900 truncate">{chat.title}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-green-600">
                            {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-xs text-green-500">{formattedDate}</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={(e) => handleDeleteClick(e, chat.id)}
                        className="p-2 my-3 mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Delete chat"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;