import { useEffect, useState } from 'react';
import initMatrixClient from '../lib/matrixClient';

const useMatrixClient = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const messageSet = new Set(); // To ensure unique messages

  useEffect(() => {
    const setupMatrixClient = async () => {
      try {
        const client = await initMatrixClient();

        // Get all rooms the user is a part of
        const rooms = client.getRooms();

        if (rooms.length > 0) {
          rooms.forEach((room) => {
            console.log('Joined room:', room.roomId);

            // Fetch timeline events from the room, only adding unique messages
            room.timeline
              .filter((event) => event.getType() === 'm.room.message')
              .forEach((event) => {
                const messageId = event.getId(); // Unique identifier for each message
                if (!messageSet.has(messageId)) {
                  messageSet.add(messageId);
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      sender: event.getSender(),
                      body: event.getContent().body,
                      room: room.name || room.roomId,  // Include room name or ID
                      application: 'Matrix', // Application source
                    },
                  ]);
                }
              });

            // Listen for new incoming messages
            const onMessage = (event, room) => {
              if (event.getType() === 'm.room.message' && room.roomId === room.roomId) {
                const messageId = event.getId(); // Unique identifier for new messages
                if (!messageSet.has(messageId)) {
                  messageSet.add(messageId);
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      sender: event.getSender(),
                      body: event.getContent().body,
                      room: room.name || room.roomId,  // Include room name or ID
                      application: 'Matrix', // Application source
                    },
                  ]);
                }
              }
            };

            // Remove any old listener and add the new one
            client.removeListener('Room.timeline', onMessage);
            client.on('Room.timeline', onMessage);
          });
        } else {
          console.log('No rooms joined.');
        }
      } catch (error) {
        console.error('Error setting up Matrix client:', error);
      }
    };

    setupMatrixClient();
  }, []);

  return { messages };
};

export default useMatrixClient;

