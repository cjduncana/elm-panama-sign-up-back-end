'use strict';

const Persons = require('../handlers/persons');

const { apiPrefix } = require('../config/server');
const SCHEMAS = require('../lib/schemas');

const API_BASE_PATH = apiPrefix + '/persons';

const routes = [];

// POST /persons
routes.push({
  method: 'POST',
  path: API_BASE_PATH,
  config: {
    auth: false,
    handler: Persons.createPerson,
    description: 'Create a person',
    notes: 'Create a new person in the system',
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Created',
            schema: SCHEMAS.Person
          },
          '400': {
            description: 'Bad Request',
            schema: SCHEMAS.Errors.BadRequestPersonError
          },
          '409': {
            description: 'Existing Person',
            schema: SCHEMAS.Errors.ExistingPersonError
          },
          '500': {
            description: 'Internal Server Error',
            schema: SCHEMAS.Errors.InternalServerError
          }
        }
      }
    },
    tags: ['api'],
    validate: {
      payload: SCHEMAS.Person
    }
  }
});

module.exports = routes;
