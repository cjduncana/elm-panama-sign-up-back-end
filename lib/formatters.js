'use strict';

function person(person) {
  return {
    id: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    email: person.email,
    wantNotifications: person.wantNotifications
  };
}

module.exports = {
  person
};
