import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d).{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and contain at least one number.'
      );
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);
    try {
      if (isRegisterMode) {
        await register(email, password);
        toast.success('Registration successful! Please log in to continue.');
        setIsRegisterMode(false);
        navigate('/login');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.detail ||
        'An error occurred';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-left">
        <h1>Welcome Back!</h1>
        <p>Log in to your account to continue.</p>
      </div>
      <div className="login-right">
        <h2>{isRegisterMode ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          {emailError && (
            <p data-testid="email-error" className="error-message">
              {emailError}
            </p>
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {passwordError && (
            <p data-testid="password-error" className="error-message">
              {passwordError}
            </p>
          )}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="spinner" /> Loading...
              </>
            ) : isRegisterMode ? (
              'Register'
            ) : (
              'Login'
            )}
          </button>
        </form>
        <button
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          className="toggle-button"
          disabled={isLoading}
        >
          {isRegisterMode
            ? 'Already have an account? Log in'
            : 'Create an account'}
        </button>
      </div>
    </div>
  );
};

export default Login;
