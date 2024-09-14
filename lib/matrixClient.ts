import "../components/init"
import * as sdk from 'matrix-js-sdk';
window.global ||= window;

const initMatrixClient = () => {
  const client = sdk.createClient({
    baseUrl: process.env.NEXT_PUBLIC_MATRIX_BASE_URL,
    accessToken: process.env.NEXT_PUBLIC_MATRIX_ACCESS_TOKEN,
    userId: process.env.NEXT_PUBLIC_MATRIX_USER_ID,
  });

  client.startClient();

  return new Promise((resolve, reject) => {
    // Listen for the synchronization completion event
    client.once('sync', (state) => {
      if (state === 'PREPARED' || state === 'SYNCING') {
        console.log('Matrix client synced successfully.');
        resolve(client);
      } else {
        reject(new Error('Matrix client sync failed.'));
      }
    });
  });
};

export default initMatrixClient;
