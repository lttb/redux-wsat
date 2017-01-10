module.exports = {
  get SOCKET() {
    return {
      onopen() {},
      send() {},
      onerror() {},
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
        action: 'test',
      }),
    };
  },
};
