const authResolver = require('./auth');
const userResolver = require('./user');
const bookingResolver = require('./booking');
const eventResolver = require('./events');

const rootResolver = {
  ...bookingResolver,
  ...eventResolver,
  ...userResolver,
  ...authResolver
};

module.exports = rootResolver;
