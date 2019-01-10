require('./config/config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {Stuff} = require('./models/stuff');
const {authenticate} = require('./middleware/authenticate')

const app = express();
var port = process.env.PORT;
app.use(bodyParser.json());

app.use('/', (req, res, next) => {
  console.log(req.method)
  console.log(req.url)
  next();
})

// console.log(new ObjectID())
// var myHex = new ObjectID();
// console.log(myHex.toHexString())

app.post('/todos', (req, res) => {
  var body = _.pick(req.body, ['text', 'completed'])


  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  var todo = new Todo({
    text: body.text,
    completed: body.completed,
    completedAt: body.completedAt
  })

  todo.save().then((result) => {
    res.send(result);
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req,res) => {
  Todo.find().then((todos)=> {
    res.send({todos})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
})

app.delete('/todos/:id', (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndDelete(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    return res.send({todo})
  }).catch((e) => {
    res.status(400).send();
  })
})

app.patch('/todos/:id', (req, res)=> {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed'])
  console.log(body)
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send({todo})
  }).catch((e) => {
    res.status(400).send()
  })
})

app.post('/users', (req,res) => {
   var body =_.pick(req.body, ['email', 'password'])
   var user = new User(body);

   // user.save().then(() => {
   //   return user.generateAuthToken();
   // }).then((token) => {
   //   res.header('x-auth', token).send(user)
   // }).catch((e) => {
   //   res.status(404).send(e);
   // })


   user.generateAuthToken()
   .then((result) => {
       user.tokens = user.tokens.concat([result]);

       user.save()
       .then((user) => res.header('x-auth', result.token).send(user))
       .catch(err => res.status(400).send(err));

   });
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.post('/users/login', (req, res) => {
  var body =_.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken()
    .then((result) => {
        user.tokens = user.tokens.concat([result]);

        user.save()
        .then((user) => res.header('x-auth', result.token).send(user))
        .catch(err => res.status(400).send(err));
    })
  }).catch((e) => {
    res.status(400).send();
  })

})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=> {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = {
  app
}
