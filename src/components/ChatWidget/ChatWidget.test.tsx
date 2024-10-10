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
});
