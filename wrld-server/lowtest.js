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
// db.defaults({ CrashDataFargo: [] })
// .write();


// const push = db.get('posts').push({ name: 'hello ruben', stuff: 'testing json' }).write();

// for(let a = 0; a < 100; a++)
// {
//     db.get('posts').push({ name: 'hello ruben' + a, stuff: 'testing json'+ a }).write();
// }

// console.log(push);

// const find = db.get('posts').find({name: 'hello ruben'}).value();
// const find = db.get('FireEvents').value();
// console.log(find);

// const values = db.get('CrashData')
// .value();

const geolib = require('geolib');
var csv = require('csv-parser');
var fs = require('fs');


const fargo=[];

// spatial query, the easy way!
// for(var g of values)
// {
     
//     let meters = geolib.getDistance(
//         {latitude: 46.8772, longitude: -96.7898},
//         {latitude: g.LAT, longitude: g.LON}
//     );

//     g.lat = g.LAT;
//     g.lng = g.LON;

//     if(meters < 15000)
//     {
//         fargo.push(g);
//         db.get('CrashDataFargo').push(g).write();
//     }
// }
db.defaults({ CrashDataFargo: [] })
.write();

let nth = 0;

fs.createReadStream('CrashData.csv')
  .pipe(csv())
  .on('data', (data) => {
        let meters = geolib.getDistance(
        {latitude: 46.87783, longitude: -96.78814},
        {latitude: data.LAT, longitude: data.LON}
    );

    //console.log(data);

    if(meters < 2000)
    {
         nth ++;

        let ng = {
            lat: data.LAT,
            lng: data.LON
        }
        
        //fargo.push(ng);

        db.get('CrashDataFargo').push(ng).write();

    }
});


//console.log(values.length);
// console.log(fargo.length);

// console.log(fargo[0]);

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