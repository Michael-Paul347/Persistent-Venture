'use client'

import MessageSummary from '../components/MessageSummary';
import UnifiedChatOverlay from '../components/UnifiedChatOverlay';

const Home = () => {
  return (
    <div>
      <h1>Matrix Unified Chat</h1>
      <MessageSummary />
      <UnifiedChatOverlay />
    </div>
  );
};

export default Home;

