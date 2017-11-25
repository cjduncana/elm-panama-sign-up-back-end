'use strict';

module.exports = {
  apiPrefix: '',
  defaultPort: 3001,
  // hostname to which swagger will make requests (must be in you /etc/hosts)
  devHost: 'local-dev',
  jwtSessionKey: process.env.SERVER_SESSION_KEY || 'm6J63c3qdkcAADSy7FgeXqLkRLqvjAGDsSPZcwKQw6QmhJyNq5FdpZAxM3E8ZqN3',
  jwtExpiresInDays: 7,
  tokenType: 'Bearer'
};
