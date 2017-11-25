'use strict';

const Joi = require('joi');

const { personId: PersonID } = require('./uuid');

module.exports = Joi.object().keys({
  id: PersonID.allow('').optional(),
  firstName: Joi.string().required()
    .description('Person\'s first name')
    .example('John')
    .label('First Name'),
  lastName: Joi.string().required()
    .description('Person\'s last name')
    .example('Doe')
    .label('Last Name'),
  email: Joi.string().email().required()
    .description('Person\'s email address')
    .example('john.doe@example.com')
    .label('Email Address'),
  wantNotifications: Joi.boolean().default(true).optional()
    .description('Whether this person want email notifications')
    .example(true)
    .label('Want Notifications')
}).label('Person');
