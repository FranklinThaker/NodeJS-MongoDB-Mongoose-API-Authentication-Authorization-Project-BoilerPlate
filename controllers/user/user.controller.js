const jwt = require('jsonwebtoken');
const usersModel = require('../../models/users');
const { successResponse, errorResponse } = require('../../helpers/helpers');

exports.register = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };

    const user = new usersModel({
      name: param.name,
      email: param.email,
      password: param.password,
      role: param.role,
      status: param.status
    })

    const data = await usersModel.findOne({ email: user.email })
    if (data) {
      throw new Error('User already exists with same email');
    }

    const newUser = await user.save();
    return successResponse(req, res, { newUser });
  } catch (error) {
    return errorResponse(req, res, error.message, error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await usersModel.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (!user) {
      throw new Error('Incorrect Username/Password');
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        let token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.SECRET, { expiresIn: 3600 });
        jwt.verify(token, process.env.SECRET, (error, data) => {
          if(error==null){
            delete data.password;
            return successResponse(req, res, { user, token, role: data.role });
          }else{
            return errorResponse(req, res, 'Authentication failed. Wrong password.', 401);
          }
        });
      }
    });
  } catch (error) {
    return errorResponse(req, res, error.message, 401);
  }
};

exports.findById = async (req, res) => {
  try {
    const user = await usersModel.findOne({ _id: req.params.id });
    if (!user) {
      throw new Error('User does not exist!');
    }
    return successResponse(req, res, { user });
  } catch (error) {
    return errorResponse(req, res, error.message, error);
  }
};

exports.getAll = async (req, res) => {
  try {
    const user = await usersModel.find();
    if (!user) {
      throw new Error('No records found!');
    }
    return successResponse(req, res, { user });
  } catch (error) {
    return errorResponse(req, res, error.message, error);
  }
};
