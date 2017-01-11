const { WS_PORT = 3333 } = process.env;

export const wsConfig = (({ protocol, hostname }) => ({
  protocol: `ws${protocol === 'https:' ? 's' : ''}`,
  host: `${hostname}:${WS_PORT}`,

  get url() { return `${this.protocol}://${this.host}`; },
}))(window.location);

export default { wsConfig };
