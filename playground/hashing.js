const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

var data = {
  id: 10
}

// var token = jwt.sign(data, '123abc')
// console.log(token)
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded)

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: "costma"
      },
      message:'${VALUE} is not a valid phone number!'
    },
  password: {
    type: String,
    require: true,
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


  var user = new UserSchema;
  console.log(user)
    var user = this;
    var access = 'auth';
    var token = {
      data: "myId",
      hexL: "id"
    }
    user.tokens.push({access, token})










// var message = "I am user number 3"
// var hash = SHA256(message).toString();
//
// console.log(`Message ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4,
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
//
// if(resultHash === token.hash) {
//   console.log("Data was not changed")
// } else {
//   console.log('Data was changed. Do not trust it')
// }
