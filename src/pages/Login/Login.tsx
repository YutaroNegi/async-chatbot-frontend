import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const Login = () => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegisterMode) {
        await register(email, password);
        alert('Registration successful! Please log in to continue.');
        setIsRegisterMode(false);
        navigate('/login');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
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
