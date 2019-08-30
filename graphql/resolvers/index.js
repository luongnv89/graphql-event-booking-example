const userResolver = require('./user');
const bookingResolver = require('./booking');
const eventResolver = require('./events');

const rootResolver = {
  ...bookingResolver,
  ...eventResolver,
  ...userResolver
};

module.exports = rootResolver;
