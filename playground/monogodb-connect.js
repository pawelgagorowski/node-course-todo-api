// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID()

console.log(obj)
// const user = {name: "pawel", age: 25}
// const  {name} = user;
//
// console.log(name)



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server')
  const db = client.db('TodoApp')


  db.collection('Todos').insertOne({
    text: 'Something else to do',
    completed: false
  }, (err, result) => {
    if(err) {
      return console.log('Unable to insert todo', err);
    }

    console.log(JSON.stringify(result.ops, null, 2))
  })


  // db.collection('Users').insertOne({
  //   name: "Pawel",
  //   age: 25,
  //   location: "Zielona Góra"
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(result.ops[0]._id.getTimestamp())
  // })
  //
  client.close();
});
