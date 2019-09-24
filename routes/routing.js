// all middlewares define here
const { authentication, authorization } = require('../middleware/middleware.js');

// All controllers define here
const user = require('../controllers/user/user.controller');

const routes = (app) => {
  app.post('/api/users/', user.register);
  app.post('/api/users/login', user.login);
  app.get('/api/users/', authentication, authorization, user.getAll);
  app.get('/api/users/:id', authentication, authorization, user.findById);
};

module.exports = { routes };
