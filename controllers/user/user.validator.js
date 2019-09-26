const Joi = require('joi');

exports.regsiter = {
    body: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,30})/),
        role: Joi.string().required(),
        status: Joi.string().required(),
    }
};

exports.login = {
    body: {
        email: Joi.string().required(),
        password: Joi.string().required(),
    }
};
