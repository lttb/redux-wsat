const WSAT = require('../');
const MOCKS = require('./mocks');

describe('Redux WSAT', () => {
  it('Get socket and wsat middleware on connection', () => {
    const { SOCKET } = MOCKS;

    const wsat = WSAT(() => SOCKET);

    expect(wsat).toBeInstanceOf(Function);
  });

  it('All listeners must be executed with right args and some of the must be overriden', () => {
    const { SOCKET, STORE, MESSAGE } = MOCKS;

    STORE.dispatch = action =>
      expect(action).toMatchObject(JSON.parse(MESSAGE.data).action);

    const dummy = _ => _;
    const onclose = jest.fn();
    const onmessage = ({ message }) => {
      expect(message).toBe(MESSAGE);
    };

    SOCKET.onclose = onclose;
    SOCKET.onmessage = onmessage;
    SOCKET.dummy = dummy;

    const wsat = WSAT(() => SOCKET);

    wsat(STORE);

    SOCKET.onmessage(MESSAGE);
    expect(SOCKET.onmessage).not.toBe(onmessage);

    SOCKET.onclose();
    expect(SOCKET.onclose).not.toBe(onclose);
    expect(onclose).toHaveBeenCalled();

    expect(SOCKET.dummy).toBe(dummy);
  });

  it('Onopen must be called after socket close all times', () => {
    const { SOCKET } = MOCKS;

    const onopen = jest.fn();

    const wsat = WSAT(() => {
      onopen();

      return SOCKET;
    });

    wsat();

    const times = ((min, max) => Math.floor(Math.random() * max) + min)(5, 20);

    Array(times).fill().forEach(SOCKET.onclose);
    expect(onopen).toHaveBeenCalledTimes(times + 1);
  });
});
