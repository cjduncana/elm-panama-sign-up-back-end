'use strict';

const Hapi = require('hapi');
const Promise = require('bluebird');

const config = require('../config/server');

const server = new Hapi.Server({
  debug: false
});

server.connection({
  port: process.env.PORT || config.defaultPort,
  routes: {
    cors: {
      origin: ['*'],
      additionalHeaders: ['Content-Type', 'Accept-Language', 'Accept-Encoding']
    }
  }
});

// Load application plugins
const plugins = [
  require('inert'),
  require('vision'),
  require('../config/logs'),
  require('../config/swagger'),
  // Need to load db first to have it available in the decorator
  require('../config/database'),
  require('../config/associations'),
  require('./helpers'),
  require('../config/authentication'),
  require('../config/policies'),
  require('../config/routes')
];

function register() {
  return server.register(plugins);
}

exports.register = register;

function initialize() {
  if (server.models) {
    return Promise.resolve();
  }

  return register(plugins).then(server.initialize.bind(server));
};

exports.initialize = initialize;

async function start() {
  await register();
  return server.start.call(server);
}

exports.start = start;

exports.info = server.info;

// Handle async unhandledRejection
process.on('unhandledRejection', () => {});

exports.server = server;
