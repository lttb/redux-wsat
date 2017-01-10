const ReduxWsatError = require('./ReduxWsatError');
const actionHelpers = require('./actionHelpers');

module.exports = (init, { prepareAction, getAction, isWSAT } = actionHelpers) => {
  let socket = init();

  const { onmessage, onclose, onerror } = socket;

  const ws = (store) => {
    socket.onmessage = (message) => {
      try {
        const action = getAction(message);

        action && store.dispatch(action);

        onmessage && onmessage({ store, message });
      } catch (error) {
        if (onerror) {
          onerror({ error, store, message });
        } else {
          throw new ReduxWsatError(error, message);
        }
      }
    };

    socket.onclose = () => {
      socket = Object.assign({}, init(), {
        onmessage: socket.onmessage,
        onclose: socket.onclose,
      });

      onclose && onclose({ store });
    };

    return next => action => (socket.readyState === 1 && isWSAT(action)
      ? socket.send(prepareAction(action))
      : next(action)
    );
  };

  return new Promise((resolve, reject) => {
    socket.onopen = () => {
      resolve({ ws, socket });
    };

    socket.onerror = (error) => {
      reject({ error, ws, socket });
    };
  });
};
