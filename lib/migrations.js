'use strict';

const Sequelize = require('sequelize');
const Umzug = require('umzug');

const { config } = require('../config/database').options;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  storage: config.storage,
  dialectOptions: {
    connectTimeout: 30000
  },
  logging: false
});

module.exports = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    tableName: 'Schema',
    columnName: 'migration',
    columnType: new Sequelize.STRING(100)
  },
  migrations: {
    params: [sequelize.getQueryInterface(), Sequelize],
    path: 'migrations',
    pattern: /^\d+[\w-]+\.js$/
  }
});
