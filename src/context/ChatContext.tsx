import React, { createContext, useState } from 'react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
}

interface ChatContextProps {
  messages: Message[]
  addMessage: (message: Message) => void
}

export const ChatContext = createContext<ChatContextProps | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }




  return ( 
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  )
}
