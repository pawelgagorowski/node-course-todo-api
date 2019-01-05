const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')

const {ObjectID} = require('mongodb')

//rozne metody usuwania

// Todo.remove({}).then((result) => {
//   console.log(result)
// })


// rekord jest nam zwracany i możemy cos z nim zrobić
// Todo.findOneAnaRemove({})

Todo.findOneAndDelete({_id:'5c2eb6e31073be66acefe6b0'}).then((result) => {
  console.log(result)
})
