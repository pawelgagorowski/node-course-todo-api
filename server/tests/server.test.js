const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo')

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 333
}]



beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done());
})

describe("POST/todos", () => {
  it('should create a new todo', (done) => {
    var text = "test todo text";

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((e) => done (e))
      })
  })
  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err) {
        return done(err)
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e))
    })

  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done);
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toString()
    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123abd')
    .expect(404)
    .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete todo doc', (done) => {
    request(app)
    .delete(`/todos/${todos[0]._id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(todos[0]._id.toString())
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      Todo.findById(todos[0]._id).then((todo) => {
        expect(todo).toBeFalsy();
        done();
      })
    })
  })
  it('should return 404 if todo not find', (done) => {
    var newId = new ObjectID();
    request(app)
    .delete(`/todos/${newId}`)
    .expect(404)
    .end(done)
  });

  it('it should return 404 for non-object ids', (done) => {
    request(app)
    .delete('/todos/1234asd')
    .expect(404)
    .end(done)
    })
  })

  describe('PATH /todos/:id', () => {
    it('should update the todo', (done) => {
      var stringId = todos[0]._id.toString();
      var text = "this should be new text";

      request(app)
      .patch(`/todos/${stringId}`)
      .send({
        completed: true,
        text,
        mojtext: "cos tam"
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true)
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        Todo.findById(todos[0]._id).then((todo) => {
          expect(todo.text).toBe(text)
          expect(todo.completed).toBe(true)
          expect(typeof todo.completedAt).toBe('number')
          done();
        }).catch((e) => done(e))
      })
    });

    it('should clear completedAt when todo is not completed', (done) => {
      var stringId = todos[1]._id.toString()
      var text = "this should be new text!!";

      request(app)
      .patch(`/todos/${stringId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        //this is what I should get in my database
        Todo.findById(stringId).then((todo) => {
          expect(todo.text).toBe(text)
          expect(todo.completed).toBe(false)
          expect(todo.completedAt).toBeFalsy();
          done();
        }).catch((e) => done(e))
      })
    });
    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toString()
      request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
      request(app)
      .get('/todos/123abd')
      .expect(404)
      .end(done)
    })
  })
