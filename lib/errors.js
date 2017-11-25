'use strict';

const errorFactory = require('error-factory');

const Errors = {
  BadRequestError: errorFactory('BadRequestError', {
    message: 'Bad Request',
    code: 'BadRequestError'
  }),
  ExistingPersonError: errorFactory('ExistingPersonError', {
    message: 'Person already exist',
    code: 'ExistingPersonError'
  })
};

module.exports = Errors;
