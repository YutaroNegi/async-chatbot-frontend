import { render, screen } from '@testing-library/react';
import Home from './Home';
import { ChatProvider } from '../../context/ChatContext';

test('renders welcome message', () => {
  const renderComponent = () => {
    return render(
      <ChatProvider>
        <Home />
      </ChatProvider>
    );
  };
  renderComponent();
  const heading = screen.getByText(/Welcome to Ava/i);
  expect(heading).toBeInTheDocument();
});
