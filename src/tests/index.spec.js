const reduxWSAT = require('../');
const MOCKS = require('./mocks');

describe('Redux WSAT', () => {
  it('Get socket and ws middleware on connection', () => {
    const { SOCKET } = MOCKS;

    setImmediate(() => SOCKET.onopen());

    return reduxWSAT(() => SOCKET).then(({ ws, socket }) => {
      expect(ws).toBeInstanceOf(Function);
      expect(socket).toBe(SOCKET);
    });
  });

  it('Get error, socket and ws middleware on connection error', () => {
    const { SOCKET, ERROR } = MOCKS;

    setImmediate(() => SOCKET.onerror(ERROR));

    return reduxWSAT(() => SOCKET).catch(({ error, ws, socket }) => {
      expect(ws).toBeInstanceOf(Function);
      expect(socket).toBe(SOCKET);
      expect(error).toBe(ERROR);
    });
  });

  it('All callbacks must be executed with right args', () => {
    const { SOCKET, STORE, MESSAGE } = MOCKS;

    Object.assign(SOCKET, {
      onmessage: ({ store, message }) => {
        expect(store).toBe(STORE);
        expect(message).toBe(MESSAGE);
      },

      onclose: ({ store }) => {
        expect(store).toBe(STORE);
      },
    });

    setImmediate(() => SOCKET.onopen());

    return reduxWSAT(() => SOCKET).then(({ ws }) => {
      ws(STORE);

      SOCKET.onmessage(MESSAGE);
      SOCKET.onclose();
    });
  });
});
