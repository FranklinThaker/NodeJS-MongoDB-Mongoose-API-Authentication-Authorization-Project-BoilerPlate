const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Users = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    status: Boolean,
  },
  {
    timestamps: true
  }
);

Users.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  next();
});

Users.methods.comparePassword = function (passw, cb) {
  // return callback(null, bcrypt.compareSync(plaintext, this.password));
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("users", Users);
