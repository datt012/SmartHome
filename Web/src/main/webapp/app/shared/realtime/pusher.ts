import Pusher, { AuthorizerCallback } from 'pusher-js';
import axios from 'axios';

if (process.env.NODE_ENV !== 'production') {
  Pusher.logToConsole = true;
}

export const pusher = new Pusher('b2af1eee963f78f9a768', {
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
