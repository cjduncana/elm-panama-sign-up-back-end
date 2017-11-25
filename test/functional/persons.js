'use strict';

require('../testHelpers');

const PersonFixture = require('../fixtures/person');

let Person;

exports.lab = Lab.script();

const server = Server.server;

describe('Person resources', () => {

  before(async () => {
    await Server.initialize();

    Person = server.models.Person;
  });

  describe('POST /persons', () => {

    const validPayload = Object.assign({}, PersonFixture);

    function callServer(payload, test) {
      return runTest.call(server, {
        method: 'POST',
        url: '/persons',
        payload
      }, test);
    }

    afterEach(async () => {
      const persons = await Person.findAll();
      return destroyAll(persons);
    });

    it('should return a newly created Person when this endpoint is used correctly', () => {
      return callServer(validPayload, ({ result, statusCode, statusMessage }) => {
        expect(statusCode).to.equal(201);
        expect(statusMessage).to.equal('Created');
        expect(result).to.equal({
          id: result.id,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          wantNotifications: true
        });
      });
    });

    describe('bad request', () => {

      it('should return a 400 Bad Request if the payload is missing', () => {
        return callServer(null, ({ result, statusCode, statusMessage }) => {
          expect(statusCode).to.equal(400);
          expect(statusMessage).to.equal('Bad Request');
          expect(result).to.equal({
            statusCode: 400,
            error: 'Bad Request',
            message: '"Person" must be an object',
            validation: {
              source: 'payload',
              keys: ['']
            }
          });
        });
      });

      it('should return a 400 Bad Request if the first name is missing from the payload', () => {
        const invalidPayload = Object.assign({}, validPayload);
        delete invalidPayload.firstName;

        return callServer(invalidPayload, ({ result, statusCode, statusMessage }) => {
          expect(statusCode).to.equal(400);
          expect(statusMessage).to.equal('Bad Request');
          expect(result).to.equal({
            statusCode: 400,
            error: 'Bad Request',
            message: 'child "First Name" fails because ["First Name" is required]',
            validation: {
              source: 'payload',
              keys: ['firstName']
            }
          });
        });
      });

      it('should return a 400 Bad Request if the last name is missing from the payload', () => {
        const invalidPayload = Object.assign({}, validPayload);
        delete invalidPayload.lastName;

        return callServer(invalidPayload, ({ result, statusCode, statusMessage }) => {
          expect(statusCode).to.equal(400);
          expect(statusMessage).to.equal('Bad Request');
          expect(result).to.equal({
            statusCode: 400,
            error: 'Bad Request',
            message: 'child "Last Name" fails because ["Last Name" is required]',
            validation: {
              source: 'payload',
              keys: ['lastName']
            }
          });
        });
      });

      it('should return a 400 Bad Request if the email address is missing from the payload', () => {
        const invalidPayload = Object.assign({}, validPayload);
        delete invalidPayload.email;

        return callServer(invalidPayload, ({ result, statusCode, statusMessage }) => {
          expect(statusCode).to.equal(400);
          expect(statusMessage).to.equal('Bad Request');
          expect(result).to.equal({
            statusCode: 400,
            error: 'Bad Request',
            message: 'child "Email Address" fails because ["Email Address" is required]',
            validation: {
              source: 'payload',
              keys: ['email']
            }
          });
        });
      });
    });

    it('should return a 409 Conflict if a Person with the same email address exists', async () => {
      await Person.createPerson(validPayload);

      return callServer(validPayload, ({ result, statusCode, statusMessage }) => {
        expect(statusCode).to.equal(409);
        expect(statusMessage).to.equal('Conflict');
        expect(result).to.equal({
          statusCode: 409,
          error: 'Conflict',
          message: 'Person already exist'
        });
      });
    });

    it('should return a 500 Internal Server Error if an unhandled error occurs', () => {
      sinon.stub(Person, 'createPerson').rejects('Error in POST /persons');

      return callServer(validPayload, ({ result, statusCode, statusMessage }) => {
        Person.createPerson.restore();

        expect(statusCode).to.equal(500);
        expect(statusMessage).to.equal('Internal Server Error');
        expect(result).to.equal({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'An internal server error occurred'
        });
      });
    });
  });
});
