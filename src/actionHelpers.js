module.exports = {
  isClientFirst: action => action.cf === true,

  isWSAT: action => action.wsat !== false,

  prepareAction: action => JSON.stringify({ action }),

  getAction: ({ data } = {}) => {
    const { action } = JSON.parse(data);

    return action && Object.assign({ wsat: false }, action);
  },
};
