var http = require("http");

var logger = require('./logger.js');
var apikey = 'AIzaSyBkbkWIfZRHpqYeDN-0L2sGFQfRHEBSMt8';

var csv = require('csv-parser');
var fs = require('fs');

var $ = 'jquery';

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBkbkWIfZRHpqYeDN-0L2sGFQfRHEBSMt8'
  });



  // Geocode an address.
// googleMapsClient.geocode({
//     address: '1600 Amphitheatre Parkway, Mountain View, CA'
//   }, function(err, response) {
//     if (!err) {
//         logger.info(response.json.results);
//         // or console.log(response.json.results);
//     }
//   });
let number =0;
 


fs.createReadStream('test.csv')
  .pipe(csv())
  .on('data', (data) => {
    console.log(`address: ${data.FireIncidentAddress}`);
    
    decodeAddress(number, data.FireIncidentAddress + ' Fargo, ND');
    number++;
});


/////////////////////
// lowdb
/////////////////////
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

//testing lowdb
db.defaults({ FireEvents: [] })
.write();



function decodeAddress(i,address){
  console.log(address);
  googleMapsClient.geocode({
      address: address
    }, (err, response) => {
      if (!err) {

          logger.info(`result ${i}`);
          
          response.json.results.forEach(function(element) {
            logger.info(element.formatted_address);
            logger.info(element.geometry.location);

            const push = db.get('FireEvents').push({ id: i,
              address: element.formatted_address,
              location: element.geometry.location}).write();

          }, this);

          // or console.log(response.json.results);
      }
    });
}