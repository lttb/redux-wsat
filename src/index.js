const ReduxWsatError = require('./ReduxWsatError');
const actionHelpers = require('./actionHelpers');

module.exports = (init, { helpers, actions = {} } = {}) => {
  const { isWSAT, prepareAction, getAction } = helpers || actionHelpers;

  return (store) => {
    let socket = {
      isOpened: () => socket.readyState === 1,
      isClosed: () => !socket.readyState || socket.readyState > 1,
    };

    const initWrapper = () => {
      const newSocket = init(store);

      const { onmessage, onclose, onerror } = newSocket;

      socket = Object.assign(newSocket, {
        isOpened: newSocket.isOpened || socket.isOpened,
        isClosed: newSocket.isClosed || socket.isClosed,
      });

      socket.onmessage = (message) => {
        try {
          const action = getAction(message);

          action && store.dispatch(action);

          onmessage && onmessage({ message });
        } catch (error) {
          if (onerror) {
            onerror({ error, message });
          } else {
            throw new ReduxWsatError(error, message);
          }
        }
      };

      socket.onclose = () => {
        initWrapper();

        onclose && onclose();
      };
    };

    if (!actions.INIT) {
      initWrapper();
    }

    return next => (action) => {
      if (socket.isOpened() && isWSAT(action)) {
        return socket.send(prepareAction(action));
      }

      if (socket.isClosed() && action.type === actions.INIT) {
        initWrapper();
      }

      return next(action);
    };
  };
};
