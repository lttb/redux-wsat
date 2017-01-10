module.exports = class ReduxWsatError extends Error {
  constructor(message, data) {
    super(`${message} with ${JSON.stringify(data)}`);

    this.name = this.constructor.name;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
};
