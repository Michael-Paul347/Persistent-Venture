import { useState } from 'react';
import useMatrixClient from '../hooks/useMatrixClient';

// Function to get a summary of a message, truncating if it's too long
const getSummary = (text: string, maxLength: number = 100) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const UnifiedChatOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const { messages } = useMatrixClient(); // Fetch all messages from the Matrix client
  const [expandedMessageIndex, setExpandedMessageIndex] = useState<number | null>(null);

  // Filter only important messages (e.g., containing the word 'urgent' or from 'ImportantRoom')
  const importantMessages = messages.filter(message => {
    return message.body.toLowerCase().includes('urgent') || message.room === 'ImportantRoom';
  });

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const toggleExpandedMessage = (index: number) => {
    if (expandedMessageIndex === index) {
      setExpandedMessageIndex(null); // Collapse the message if it's already expanded
    } else {
      setExpandedMessageIndex(index); // Expand the selected message
    }
  };

  return (
    <>
      {/* Always render the toggle button outside the overlay */}
      <button
        onClick={toggleOverlay}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1100, // Ensure the button is above the overlay
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {showOverlay ? 'Close Unified Chat' : 'Open Unified Chat'}
      </button>

      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            zIndex: 1000, // The overlay is below the button
            padding: '20px',
            overflowY: 'scroll', // Allow scrolling for longer lists
          }}
        >
          <h2>Unified Chat - Important Messages</h2>
          {importantMessages.length > 0 ? (
            <ul>
              {importantMessages.map((message, index) => (
                <li key={index} style={{ marginBottom: '20px' }}>
                  <strong>{message.sender}</strong> from <em>{message.room}</em> ({message.application}):
                  <br />
                  {/* Display truncated message or full message depending on expanded state */}
                  {expandedMessageIndex === index ? (
                    <>
                      <p>{message.body}</p>
                      <button
                        onClick={() => toggleExpandedMessage(index)}
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          padding: '5px 10px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Show Less
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{getSummary(message.body)}</p>
                      {message.body.length > 100 && (
                        <button
                          onClick={() => toggleExpandedMessage(index)}
                          style={{
                            backgroundColor: 'white',
                            color: 'black',
                            padding: '5px 10px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Read More
                        </button>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No important messages yet.</p>
          )}
        </div>
      )}
    </>
  );
};

export default UnifiedChatOverlay;


