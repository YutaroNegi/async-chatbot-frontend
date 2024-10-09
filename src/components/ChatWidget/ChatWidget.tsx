import React, { useState, useEffect, useContext, useRef } from 'react';
import './ChatWidget.css';
import { ChatContext } from '../../context/ChatContext';
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
} from '../../services/chatService';

import {
  FaSpinner,
  FaExpand,
  FaCompress,
  FaTimes,
  FaPaperPlane,
  FaEllipsisV,
  FaCheck,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import AvaProfile from '../../assets/ava-profile.png';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);

  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error('ChatWidget must be used within a ChatProvider');
  }

  const { messages, setMessages } = chatContext;

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await getMessages();
      const sortedMessages = response.data.messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Error fetching messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      const response = await sendMessage(newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.user_message,
      ]);
      setNewMessage('');
      startTypingEffect(response.data.bot_response);
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(error.response?.data?.detail || 'Error sending message');
    } finally {
      setIsSending(false);
    }
  };

  const startTypingEffect = (botResponse: any) => {
    const fullText = botResponse.content;
    let currentText = '';
    let index = 0;
    setTypingMessageId(botResponse.id_message);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText.charAt(index);
        index++;
        setMessages((prevMessages) => {
          const messagesWithoutTyping = prevMessages.filter(
            (msg) => msg.id_message !== botResponse.id_message
          );
          return messagesWithoutTyping.concat({
            ...botResponse,
            content: currentText,
          });
        });
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setTypingMessageId(null);
      }
    }, 30);
  };

  const handleEditMessage = async (id_message: string) => {
    if (!editedContent.trim()) {
      alert('Message content cannot be empty.');
      return;
    }
    setIsEditing(true);
    try {
      await editMessage(id_message, editedContent);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id_message === id_message
            ? { ...msg, content: editedContent }
            : msg
        )
      );
      setEditingMessageId(null);
      setEditedContent('');
      setShowOptionsFor(null);
    } catch (error: any) {
      console.error('Error editing message:', error);
      alert(error.response?.data?.detail || 'Error editing message');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteMessage = async (id_message: string) => {
    try {
      await deleteMessage(id_message);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id_message !== id_message)
      );
      setShowOptionsFor(null);
    } catch (error: any) {
      console.error('Error deleting message:', error);
      alert(error.response?.data?.detail || 'Error deleting message');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleMessageOptions = (id_message: string) => {
    setShowOptionsFor((prevId) => (prevId === id_message ? null : id_message));
  };

  return (
    <div className="chat-widget">
      {isOpen ? (
        <div className={`chat-window${isExpanded ? ' expanded' : ''}`}>
          <div className="chat-header">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Minimizar Chat' : 'Expandir Chat'}
              className="chat-header-button expand-button"
            >
              {isExpanded ? <FaCompress /> : <FaExpand />}
            </button>
            <button
              onClick={toggleChat}
              aria-label="Fechar Chat"
              className="chat-header-button close-button"
            >
              <FaTimes />
            </button>
          </div>
          <div className="chat-welcome">
            <img src={AvaProfile} alt="Ava" className="ava-profile" />
            <h4>
              Hi, I'm Ava{' '}
              <span role="img" aria-label="waving hand">
                👋
              </span>
            </h4>
            <p>Ask me anything</p>
          </div>
          <div className="chat-messages" ref={messagesContainerRef}>
            {messages.map((msg) => (
              <div
                key={msg.id_message}
                className={`message ${msg.is_bot ? 'bot' : 'user'}`}
              >
                {editingMessageId === msg.id_message ? (
                  <div className="edit-message">
                    <input
                      type="text"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEditMessage(msg.id_message);
                        }
                      }}
                      autoFocus
                      aria-label="Edit message"
                    />
                    <div className="edit-message-buttons">
                      <button
                        onClick={() => handleEditMessage(msg.id_message)}
                        aria-label="Salvar edição"
                        disabled={isEditing}
                      >
                        {isEditing ? (
                          <FaSpinner className="spinner" />
                        ) : (
                          <FaCheck />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingMessageId(null);
                          setShowOptionsFor(null);
                        }}
                        aria-label="Cancelar edição"
                        className="cancel-button"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{msg.content}</p>
                    {!msg.is_bot && (
                      <div className="message-actions">
                        <button
                          onClick={() => toggleMessageOptions(msg.id_message)}
                          aria-label="Opções da mensagem"
                        >
                          <FaEllipsisV />
                        </button>
                        {showOptionsFor === msg.id_message && (
                          <div className="message-options">
                            <button
                              onClick={() => {
                                setEditingMessageId(msg.id_message);
                                setEditedContent(msg.content);
                                setShowOptionsFor(null);
                              }}
                              aria-label="Editar mensagem"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteMessage(msg.id_message)
                              }
                              aria-label="Deletar mensagem"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              aria-label="Message"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              aria-label="Send message"
              disabled={isSending}
            >
              {isSending ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
            </button>
          </div>
        </div>
      ) : (
        <button
          className="chat-toggle-button"
          onClick={toggleChat}
          aria-label="Abrir Chat"
        >
          <img
            src={AvaProfile}
            alt="Abrir Chat"
            className="chat-toggle-image"
          />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
