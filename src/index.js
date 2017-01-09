export default (init, {
  prepareAction = action => JSON.stringify({ action }),

  isWSAT = action => action.wsat !== false,

  getAction = ({ data }) => {
    const { action } = JSON.parse(data);

    return action && Object.assign({ wsat: false }, action);
  },
} = {}) => {
  let socket = init();

  const { onclose, onmessage } = socket;

  const ws = (store) => {
    socket.onmessage = (message) => {
      const action = getAction(message);

      action && store.dispatch(action);

      onmessage && onmessage({ store, message });
    };

    socket.onclose = () => {
      socket = Object.assign(init(), {
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
