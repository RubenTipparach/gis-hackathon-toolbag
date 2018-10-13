'use strict';
var express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10);

var bodyParser = require('body-parser');
// ACTIVATE CORS!
var cors = require('cors');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var colors = require('colors');
var strFormat = require('string-format');
var sql = require('mssql');

var logger = require('./logger.js');
var sqlServer = require('./sqllib/sqlserver.js');
var config = require('./config.json');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ addressBook: [] })
  .write()

logger.level = 'error';

console.log(config.sqlConn);

var sqlConn = new sqlServer(config.sqlConn);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());


server.listen(config.port_number, () => {
    logger.info(`Map started on port ${config.port_number.toString().green.bold}`);
});

//Goglemaps: AIzaSyBsD9aPrWPVV09M_XV4XBH_471ejwAw44I
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAH4CLVpfQVqqLMPwyb24vg2Pihvacc4LI'
});

app.post('/api/comms', (req, res) =>
{	
	//console.log(req.raw);
	//console.log(req.body);

	for( var i in req)
	{
	//	console.log(i);
	}

	console.log("--------------");
	console.log(req.body);
	console.log(req.query);

    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");

	res.send("blah");
});

let addressBook = [];

app.get('/geocode', (req, res) =>
{
	addressBook = [];

    sqlConn.SqlSelectParamCall(    `
		SELECT TOP 100 id,
		[Ship-To_ADR1]
      ,[Ship-To_ADR2]
      ,[Ship-To_City]
      ,[Ship-To_State]
      ,[Ship-To_Zip]
      ,[Ship-To_Country]
		FROM [FAR_ 06-01-2017-to-06-30-2018_Defects Dt Range Selected-DeliveryDamages]
		WHERE [Ship-To_ADR1] not in ('NA', '')
		`, [], (data) => {

			let i = 0;
			for(var d of data){
				let addy = {a: d["Ship-To_ADR1"] + ", " + d["Ship-To_City"] + ", " +  d["Ship-To_State"], id: d["id"]};

				((ind) => {
				   setTimeout(() => {

					   runGoogleMapsCode(addy.id, addy.a);
					   if(i === data.length - 1){
							res.send(data);}
					   }, 100 * ind);
				})(i);

				i++;
			}			


		});
});


function runGoogleMapsCode(id, address){
	logger.info('sendin google data');
	logger.info(address);
	googleMapsClient.geocode({ address: address }, (err, response) => {
				if (!err) {
					//logger.info(response.json.results);
				}

				let first = response.json.results[0];
				
				let result = {id: id,  address: address, LatLong : "not found" };
				//logger.info(response);
				//logger.info(first.geometry);

				if(first){
					result.LatLong = first.geometry.location;
				}
				try
				{
					db.get('addressBook')
					  .push(result)
					  .write();
					logger.info(3);
					addressBook.push(result);
					logger.info(4);
				}
				catch (e)
				{
					logger.info(error);
				}

				logger.info(result);
		});
}

app.get('/testencode', (req,res) => 
{
	let addy = "100 BARNEY DRIVE, JOLIET, IL"

	googleMapsClient.geocode({address: addy}, (err, response) => {
		if (!err) {
			console.log(response.json.results);
		}
		let result = {address: addy, LatLong:response}
		
		/*
		db.get('addressBook')
		  .push(result)
		  .write()
		*/

		//addressBook.push(result);
		logger.info(response);
		res.send(response);
	});
});

app.get('/addressBook', (req, res) =>
{
	let value =  db.get('addressBook').value();
	res.send(value);
});

app.get('/getDataById/:id', (req, res) =>
{

	    sqlConn.SqlSelectParamCall(    `
		SELECT TOP 100 id,
		[Ship-To_ADR1]
      ,[Ship-To_ADR2]
      ,[Ship-To_City]
      ,[Ship-To_State]
      ,[Ship-To_Zip]
      ,[Ship-To_Country]
		FROM [FAR_ 06-01-2017-to-06-30-2018_Defects Dt Range Selected-DeliveryDamages]
		WHERE id = ${req.params.id}
		`, [], (data) => {
			res.send(data);
		});
});