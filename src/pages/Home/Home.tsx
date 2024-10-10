import React, { useContext } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import ChatWidget from '../../components/ChatWidget/ChatWidget';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>Welcome to Ava</h1>
          <button
            className="logout-button"
            onClick={logout}
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>
      <main className="home-main">
        <section className="welcome-section">
          <h2>Chat with Ava</h2>
          <p>
            Click on the chat icon at the bottom right corner to get started!
          </p>
        </section>
      </main>
      <ChatWidget />
    </div>
  );
};

export default Home;
