export default (init, {
  prepareAction = action => JSON.stringify({ action }),
  isWSAT = action => action.wsat !== false,
  getAction = ({ data }) => {
    const { action } = JSON.parse(data);

    return action && Object.assign({ wsat: false }, action);
  },
} = {}) => {
  let socket = init();

  const { onclose, onopen, onmessage } = socket;

  const ws = (store) => {
    socket.onmessage = (message) => {
      const action = getAction(message);

      action && store.dispatch(action);
      onmessage && onmessage(message);
    };

    return next => action => (isWSAT(action)
      ? socket.send(prepareAction(action))
      : next(action)
    );
  };

  socket.onclose = () => {
    socket = Object.assign(init(), {
      onmessage: socket.onmessage,
      onclose: socket.onclose,
    });

    onclose && onclose();
  };

  return new Promise((resolve) => {
    socket.onopen = () => {
      onopen();

      resolve({ ws, socket });
    };
  });
};
