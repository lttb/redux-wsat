module.exports = {
  get SOCKET() {
    return {
      onmessage() {},
      send() {},
      onclose() {},
    };
  },

  get STORE() {
    return {
      dispatch() {},
    };
  },

  get ERROR() {
    return {
      message: 'Socket error mock',
    };
  },

  get MESSAGE() {
    return {
      data: JSON.stringify({
        action: {
          type: 'test',
        },
      }),
    };
  },
};
