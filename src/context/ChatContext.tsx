import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

interface Message {
  id_message: string;
  content: string;
  is_bot: boolean;
  timestamp: string;
}

interface ChatContextProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  addMessage: (message: Message) => void;
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <ChatContext.Provider value={{ messages, setMessages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
