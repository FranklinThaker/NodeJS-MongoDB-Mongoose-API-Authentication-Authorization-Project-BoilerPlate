const { successResponse, errorResponse } = require('../helpers/helpers');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/users');
var authorizationData = []

exports.rememberMeTokenVerification = async function (req, res, next) {
  try {
    let decoded;
    headers = req.headers;
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization;
      decoded = jwt.verify(token, process.env.SECRET);

      delete decoded.password;
      req.user = decoded;
      const user = await usersModel.findOne({ _id: decoded._id });
     
      if (user) {
        newUser = user.toObject()
        if (user.status == true) {
          delete newUser.password;
          return successResponse(req, res, { newUser, token }, "You're now logged in!");
        }
      } else {
        return errorResponse(req, res, "User does not exist!", 401);
      }
    } else {
      return next();
    }
  }
  catch (error) {
    return errorResponse(req, res, error.message, 401);
  }
}

exports.authentication = async function (req, res, next) {
  let decoded;
  headers = req.headers;
  if (!(req.headers && req.headers.authorization)) {
    return errorResponse(req, res, 'Token is not provided', 401);
  }
  const token = req.headers.authorization;
  try {
    decoded = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return errorResponse(req, res, 'Invalid token!', 401);
  }
  delete decoded.password;
  req.user = decoded;
  const user = await usersModel.findOne({ _id: decoded._id });

  if (!user) {
    return errorResponse(req, res, 'User is not found in system', 401);
  } else {
    res.locals.ROLE = user.role
    res.locals.METHOD = req.method
    res.locals.URL = req.url
    return next();
  }
}

exports.getROLES = async function () {
  var path = require('path')
  var csvPath = path.resolve(path.join(__dirname, "policy.csv"));

  const csv = require('csvtojson')
  await csv()
    .fromFile(csvPath)
    .then((jsonObj) => {
      authorizationData.push.apply(authorizationData, jsonObj)
    })
}

exports.authorization = async function (req, res, next) {
  for (var i = 0; i < authorizationData.length; i++) {
    if (authorizationData[i].role == res.locals.ROLE) {
      if (authorizationData[i].method == res.locals.METHOD) {
        str1 = authorizationData[i].url.split('/');
        sysURL = str1.pop()
        str2 = res.locals.URL.split('/')
        reqURL = str2.pop()
        if (sysURL == "params" && reqURL.length > 0) {
          return next();
        }
        if (sysURL != "params" && reqURL.length == 0) {
          return next();
        }
      } else if (authorizationData[i].method == "*") {
        str1 = authorizationData[i].url.split('/');
        sysURL = str1.pop()
        str2 = res.locals.URL.split('/')
        reqURL = str2.pop()
        if (sysURL == "params" && reqURL.length > 0) {
          return next();
        }
        if (sysURL != "params" && reqURL.length == 0) {
          return next();
        }
      }
    }
  }
  return errorResponse(req, res, "You're not authorized", 401);
}
