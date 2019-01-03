const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')

const {ObjectID} = require('mongodb')

const id = '5c2d523ff0b59728c361a5bb';
//
// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }
//
//
//  Todo.find({
//    _id: id
//  }).then((todos)=> {
//    console.log('Todos', todos)
//  })
//
//  Todo.findOne({
//    _id: id
//  }).then((todo) => {
//    console.log('Todo', todo)
//  })
//
//  Todo.findById(id).then((todo) => {
//    if(!todo) {
//      console.log('Id not found')
//    }
//    console.log('Todo By Id', todo)
//  }).catch((e) => console.log(e))

if(!ObjectID.isValid(id)) {
return console.log("Invalid Id")
}

User.findById(id).then((user) => {
  if(!user) {
    return console.log("Unable to find user")
  }
  console.log(JSON.stringify(user, null, 2))
}, (e) => {
  console.log(e)
})
