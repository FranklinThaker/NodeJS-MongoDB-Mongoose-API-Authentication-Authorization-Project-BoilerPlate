/* eslint-disable no-unused-vars */
const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');
const glob = require('glob');

// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { getROLES } = require('./middleware/middleware');

// Load environment variables.
require('dotenv').config();

// Configuring the database
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(process.env.DB_DIALECT+"://"+process.env.DB_HOST+":"+process.env.DB_PORT+"/"+process.env.DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


const app = express();

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/', express.static('./public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials: true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, *, Accept, x-authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

const initRoutes = (app) => {
  // including all routes
  glob('./routes/*.js', (err, routes) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('Error occured including routes');
      return;
    }
    routes.forEach((routePath) => {
      require(routePath).routes(app); // eslint-disable-line
    });
    // eslint-disable-next-line no-console
    console.warn('No of routes file : ', routes.length);
  });
};



initRoutes(app);
getROLES() // to generate the ROLE object for role based authorization/authentication
app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line no-console
  console.log(chalk.blue('App listening on port 8080!'));
});
