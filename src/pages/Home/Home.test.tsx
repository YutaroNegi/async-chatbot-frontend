// src/pages/Home/Home.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';
import { AuthContext } from '../../context/AuthContext';
import { ChatProvider } from '../../context/ChatContext';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

describe('Home Component', () => {
  const loginMock = vi.fn();
  const registerMock = vi.fn();
  const logoutMock = vi.fn();

  const renderComponent = () =>
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          login: loginMock,
          register: registerMock,
          logout: logoutMock,
        }}
      >
        <ChatProvider>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </ChatProvider>
      </AuthContext.Provider>
    );

  test('renders welcome message and logout button', () => {
    renderComponent();
    expect(screen.getByText(/Welcome to Ava/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Logout/i)).toBeInTheDocument();
  });

  test('calls logout function when logout button is clicked', () => {
    renderComponent();
    const logoutButton = screen.getByLabelText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(logoutMock).toHaveBeenCalled();
  });
});
