import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWidget from './ChatWidget';
import { ChatProvider } from '../../context/ChatContext';
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
} from '../../services/chatService';
import { vi, Mock } from 'vitest';

vi.mock('../../services/chatService');

describe('ChatWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <ChatProvider>
        <ChatWidget />
      </ChatProvider>
    );
  };

  test('renders chat toggle button', () => {
    renderComponent();
    const toggleButton = screen.getByRole('button', { name: /abrir chat/i });
    expect(toggleButton).toBeInTheDocument();
  });

  test('opens chat window when toggle button is clicked', async () => {
    renderComponent();
    const toggleButton = screen.getByRole('button', { name: /abrir chat/i });
    userEvent.click(toggleButton);

    const welcomeMessage = await screen.findByText(/hi, i'm ava/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('fetches and displays messages when chat is opened', async () => {
    (getMessages as Mock).mockResolvedValueOnce({
      data: {
        messages: [
          {
            id_message: '1',
            content: 'Hello!',
            is_bot: false,
            timestamp: new Date().toISOString(),
          },
          {
            id_message: '2',
            content: 'Hi there!',
            is_bot: true,
            timestamp: new Date().toISOString(),
          },
        ],
      },
    });

    renderComponent();

    userEvent.click(screen.getByRole('button', { name: /abrir chat/i }));

    await waitFor(() => {
      expect(getMessages).toHaveBeenCalled();
    });

    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  test('sends a new message and displays bot response', async () => {
    (sendMessage as Mock).mockResolvedValueOnce({
      data: {
        user_message: {
          id_message: '3',
          content: 'How are you?',
          is_bot: false,
          timestamp: new Date().toISOString(),
        },
        bot_response: {
          id_message: '4',
          content: 'I am fine, thank you!',
          is_bot: true,
          timestamp: new Date().toISOString(),
        },
      },
    });

    renderComponent();

    userEvent.click(screen.getByRole('button', { name: /abrir chat/i }));

    const input = await screen.findByPlaceholderText(/type your message/i);
    await userEvent.type(input, 'How are you?');

    const sendButton = screen.getByRole('button', { name: /send message/i });
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith('How are you?');
    });

    expect(screen.getByText('How are you?')).toBeInTheDocument();
  });

  test('deletes a message', async () => {
    (getMessages as Mock).mockResolvedValueOnce({
      data: {
        messages: [
          {
            id_message: '6',
            content: 'Message to delete',
            is_bot: false,
            timestamp: new Date().toISOString(),
          },
        ],
      },
    });

    (deleteMessage as Mock).mockResolvedValueOnce({});

    renderComponent();

    userEvent.click(screen.getByRole('button', { name: /abrir chat/i }));

    await waitFor(() => {
      expect(getMessages).toHaveBeenCalled();
    });

    userEvent.click(screen.getByLabelText('Opções da mensagem'));

    const deleteButton = await screen.findByLabelText('Deletar mensagem');

    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteMessage).toHaveBeenCalledWith('6');
    });

    expect(screen.queryByText('Message to delete')).not.toBeInTheDocument();
  });
});
