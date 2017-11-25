'use strict';

const Sequelize = require('sequelize');

const Errors = require('../lib/errors');

module.exports = function(db) {
  const Person = db.define('Person', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    wantNotifications: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'persons'
  });

  // Static Methods

  Person.createPerson = async function(personData) {
    delete personData.id;

    try {
      const person = await this.create(personData);

      return person;
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new Errors.ExistingPersonError();
      }

      throw e;
    }
  };

  return Person;
};
