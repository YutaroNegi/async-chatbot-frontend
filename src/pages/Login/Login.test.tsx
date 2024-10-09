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

window.alert = vi.fn();

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

  test('allows the user to log in', async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('user@example.com', 'password123');
    });

    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  test('allows the user to register', async () => {
    renderComponent();

    const toggleButton = screen.getByRole('button', {
      name: /create an account/i,
    });
    await userEvent.click(toggleButton);

    const registerButton = screen.getByRole('button', { name: /register/i });
    expect(registerButton).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'newpassword123');
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith(
        'newuser@example.com',
        'newpassword123'
      );
    });

    expect(window.alert).toHaveBeenCalledWith(
      'Registration successful! Please log in to continue.'
    );
    expect(toggleButton).toHaveTextContent(/create an account/i);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('displays loading state during login', async () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeEnabled();

    loginMock.mockImplementation(
      () => new Promise<void>((resolve) => setTimeout(resolve, 1000))
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
    });
  });

  test('shows error message on failed login', async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    const error = { response: { data: { detail: 'Invalid credentials' } } };
    loginMock.mockRejectedValue(error);

    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
    });

    expect(loginButton).toBeEnabled();
    expect(loginButton).toHaveTextContent(/login/i);
  });
});
