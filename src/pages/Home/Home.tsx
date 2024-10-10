import React from 'react';
import ChatWidget from '../../components/ChatWidget/ChatWidget';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Ava</h1>
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
