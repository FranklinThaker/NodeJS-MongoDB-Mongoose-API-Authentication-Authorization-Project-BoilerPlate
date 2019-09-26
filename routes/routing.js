// all middlewares define here
const { authentication, authorization, rememberMeTokenVerification } = require('../middleware/middleware.js');
var validate = require('express-validation')
var userValidator = require('../controllers/user/user.validator')
const { errorHandler } = require('../middleware/errorHandler')

// All controllers define here
const user = require('../controllers/user/user.controller');

const routes = (app) => {
  app.post('/api/users/', validate(userValidator.regsiter), user.register);
  app.post('/api/users/login', rememberMeTokenVerification, validate(userValidator.login), user.login);
  app.get('/api/users/', authentication, authorization, user.getAll);
  app.get('/api/users/:id', authentication, authorization, user.findById);
  app.use(errorHandler)
};

module.exports = { routes };
