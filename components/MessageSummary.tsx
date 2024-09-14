import useMatrixClient from '../hooks/useMatrixClient';

const MessageSummary = () => {
  const { messages } = useMatrixClient();

  return (
    <div>
      <h2>Incoming Messages</h2>
      {messages.length > 0 ? (
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.sender}</strong>: {message.body} 
              <br />
              <em>Room:</em> {message.room} 
              <br />
              <em>App:</em> {message.application}
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};

export default MessageSummary;




