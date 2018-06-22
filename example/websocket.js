// @flow
import {halt, listen, apply, createSelector, request, upgrade} from '../src';
import {Server} from 'ws';

const webSocketManager = createSelector(request, () => {
  return new Server({
    noServer: true,
  });
});

const websocket = createSelector(
  webSocketManager,
  upgrade,
  async (server, {req, socket, head}): Promise<WebSocket> => {
    return new Promise((resolve) => {
      server.handleUpgrade(req, socket, head, resolve);
    });
  },
);

const app = apply(websocket, webSocketManager, (socket, {clients}) => {
  // TODO: Flow doesn't seem to type this event properly.
  // $ExpectError
  socket.addEventListener('message', ({data}: MessageEvent) => {
    clients.forEach((target) => {
      if (target !== socket) {
        socket.send(data);
      }
    });
  });
  return halt;
});

listen(app, 8080);
