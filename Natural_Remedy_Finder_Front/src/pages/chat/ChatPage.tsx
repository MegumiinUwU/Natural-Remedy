import Layout from '../../layout/ChatLayout';
import { ChatProvider } from '../../context/ChatContext';
import styles from './ChatPage.module.css';

function ChatPage() {
  return (
    <ChatProvider>
      <div className={styles.chatRoot}>
        <Layout />
      </div>
    </ChatProvider>
  );
}

export default ChatPage;