const webSockets = require('ws');

const port = process.env.WS_PORT || 3333;
const wss = new webSockets.Server({ port });

wss.on('connection', ws =>
  ws.on('message', message =>
    wss.clients.forEach(client => client.send(message))));
