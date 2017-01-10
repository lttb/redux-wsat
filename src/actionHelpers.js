module.exports = {
  prepareAction: action => JSON.stringify({ action }),

  isWSAT: action => action.wsat !== false,

  getAction: ({ data } = {}) => {
    const { action } = JSON.parse(data);

    return action && Object.assign({ wsat: false }, action);
  },
};
