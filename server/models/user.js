const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      },
      message:'${VALUE} is not a valid phone number!'
    },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
      }
    }]
  })

  UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])

  }

  UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
      decoded = jwt.verify(token, 'abc123');
      console.log(decoded)
    } catch (e) {
      // return new Promise (resolve, reject) => {
      //   reject();
      // }

      //albo

      return Promise.reject('test');
    }

    return User.findOne({
      _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    })

  }


// metoda pierwsza według instruktora

  // UserSchema.methods.generateAuthToken = function () {
  //   var user = this;
  //   var access = 'auth';
  //   var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  //
  //   user.tokens.push({access, token});
  //
  //   return user.save().then(() => {
  //     return token;
  //   });
  // };

// metoda druga z Promise
  UserSchema.methods.generateAuthToken = function () {
    return new Promise((resolve, reject) => {
        const user = this;
        const access = 'auth';

        const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

        resolve({access, token});
    });
};

UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
      })
    })
  } else {
    next();
  }
})




var User = mongoose.model('User', UserSchema)

module.exports = {
  User
}
