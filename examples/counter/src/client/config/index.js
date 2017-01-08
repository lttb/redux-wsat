const { WS_PORT = 3333 } = process.env;

export const wsConfig = (({ protocol, hostname }) => ({
  protocol: `ws${protocol === 'https:' ? 's' : ''}`,
  host: `${hostname}:${WS_PORT}`,
}))(window.location);

export default { wsConfig };
