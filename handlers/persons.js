'use strict';

const Boom = require('boom');

const Formatters = require('../lib/formatters');
const Errors = require('../lib/errors');

// POST /persons
exports.createPerson = async function({ payload }, reply) {
  try {
    const person = await this.models.Person.createPerson(payload);

    return reply(Formatters.person(person)).code(201);
  } catch (e) {
    return errorHandler.call(this, e, reply);
  }
};

function errorHandler(e, reply) {
  if (e instanceof Errors.ExistingPersonError) {
    return reply(Boom.conflict(e.message));
  }

  return this.helpers.errorHandler.call(this, reply, e);
}
