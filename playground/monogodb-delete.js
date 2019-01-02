// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server')
  var db = client.db();

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'More and more to do'}).then((result) => {
  //   console.log(result)
  // })

  //deleteOne
  // db.collection('Todos').deleteOne({text: 'more and more'}).then((result) => {
  //   console.log(result)
  // })

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result)
  // })


  //chalenge

    // db.collection('Users').deleteMany({name:'Pawel'}).then((result) => {
    //   console.log(result);
    // })

    // db.collection('Users').deleteMany({location: 'Texas'}).then((result) => {
    //   console.log(result)
    // })

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c2d2c8f2a9622c4d9c5b657')})
    .then((result) => {
      console.log(JSON.stringify(result,null,2))
    })


  //client.close()
});
