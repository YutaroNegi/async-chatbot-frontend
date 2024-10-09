import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { AuthContext } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('Login Component', () => {
  const loginMock = vi.fn();
  const registerMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: loginMock,
          register: registerMock,
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test('renders the login form', () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows password validation error when password is invalid', async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'short');
    await userEvent.click(loginButton);

    const passwordError = await screen.findByTestId('password-error');
    expect(passwordError).toHaveTextContent(
      /Password must be at least 8 characters long and contain at least one number./i
    );

    const emailError = screen.queryByTestId('email-error');
    expect(emailError).not.toBeInTheDocument();
  });

  test('displays loading state during login', async () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeEnabled();

    loginMock.mockImplementation(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100))
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent(/loading/i);

    await waitFor(() => {
      expect(loginButton).toBeEnabled();
      expect(loginButton).toHaveTextContent(/login/i);
    });
  });

  test('shows error toast on failed login', async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    const error = {
      response: {
        data: {
          detail: [
            {
              msg: 'Invalid credentials',
            },
          ],
        },
      },
    };
    loginMock.mockRejectedValue(error);

    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpassword1');
    await userEvent.click(loginButton);

    const errorToast = await screen.findByText(/Invalid credentials/i);
    expect(errorToast).toBeInTheDocument();

    expect(loginButton).toBeEnabled();
    expect(loginButton).toHaveTextContent(/login/i);
  });

  test('allows the user to log in', async () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: /login/i });
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    loginMock.mockResolvedValueOnce();

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('user@example.com', 'password123');
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
