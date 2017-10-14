const express = require('express');
const bodyParser = require('body-parser');

/////////////////////
// lowdb
/////////////////////
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
/////////////////////

//testing lowdb
// db.defaults({ posts: [] })
// .write();


// const push = db.get('posts').push({ name: 'hello ruben', stuff: 'testing json' }).write();

// for(let a = 0; a < 100; a++)
// {
//     db.get('posts').push({ name: 'hello ruben' + a, stuff: 'testing json'+ a }).write();
// }

// console.log(push);

// const find = db.get('posts').find({name: 'hello ruben'}).value();
const find = db.get('FireEvents').value();
console.log(find);

// Create server
const app = express();
app.use(bodyParser.json());


// low(adapter).then(db => {
//     // Routes
//     // GET /posts/:id
//     app.get('/posts/:id', (req, res) => {
//         const post = db.get('posts')
//         .find({ id: req.params.id })
//         .value();

//         res.send(post);
//     });

//     // POST /posts
//     app.post('/posts', (req, res) => {
//         db.get('posts')
//         .push(req.body)
//         .last()
//         .assign({ id: Date.now().toString() })
//         .write()
//         .then(post => res.send(post))
//     });

//     // Set db default values
//     return db.defaults({ posts: [] }).write();
//     })
//     .then(() => {
//         app.listen(3000, () => console.log('listening on port 3000'))
// });