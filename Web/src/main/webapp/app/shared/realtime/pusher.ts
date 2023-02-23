import Pusher, { AuthorizerCallback } from 'pusher-js';
import axios from 'axios';

if (process.env.NODE_ENV !== 'production') {
  Pusher.logToConsole = true;
}

export const pusher = new Pusher('cf76f2b2b00aee9a32ae', {
  cluster: 'ap1',
  authorizer(channel, _) {
    return {
      async authorize(socketId: string, callback: AuthorizerCallback) {
        try {
          const payload = {
            socket_id: socketId,
            channel_name: channel.name,
          };
          const response = await axios.post('/api/pusher/auth', payload);
          callback(null, { auth: response.data.auth });
        } catch (e) {
          callback(e, { auth: '' });
        }
      },
    };
  },
});
