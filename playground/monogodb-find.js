// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server')
  var db = client.db();
  //no arguments
  // db.collection("Todos").find().toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, null, 2))
  // }, (err) => {
  //   console.log("Unable to fetch")
  //
  // })


  // passing arguments
  // db.collection("Todos").find({
  //   _id: new ObjectID ('5c2d10c7bdf1da1a17c53b5e')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, null, 2))
  // }, (err) => {
  //   console.log("Unable to fetch")
  // })


  //ile rekordów w kolekcji
  // db.collection("Todos").find().count().then((count) => {
  //   console.log(`Todo count ${count}`);
  // }, (err) => {
  //   console.log("Unable to fetch")
  // })

  db.collection('Users').find({name: "Pawel"}).toArray().then((result) => {
    console.log('Users with Pawel name')
    console.log(JSON.stringify(result, null, 2))
  }, (err) => {
    console.log("Unable to fetch")
  })



  // w wersji z callbackiem
  // db.collection('Users').findOne({}, (err, result) => {
  //   if (err) return err
  //     console.log('Users');
  //     console.log(JSON.stringify(result, null, 2))
  //
  // })
});
