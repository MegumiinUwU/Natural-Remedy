import React from 'react';
import Sidebar from './sidebar';
import ChatContainer from '../components/Chat/ChatContainer';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-green-50/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatContainer />
      </div>
    </div>
  );
};

export default Layout;