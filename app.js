"use strict"

var express = require('express');
var app = express();
var settings = require('./settings');
var port = settings.port;
var garden = {};


// establish streams for RaspPi components
// var GpioStream = require('gpio-stream');
// var button = GpioStream.readable(17);
// var led = GpioStream.writable(18);

// set up logging middleware
// var logger = require('morgan');
// app.use(logger('common'));

// set up body parser middleware to handle POST data
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:false}));

// set view engine for rendering 
app.set('view engine', 'ejs');

// pipe button presses to led
// var write_stream = button.pipe(led);
// pipe button presses to stdout
// button.pipe(process.stdout);

// body should be of form {"name": xxx,"moisture": xxx}
app.post('/garden', function(req,res) {
  console.log('received post from plant:');
  console.log(JSON.stringify(req.body));
  var plant = req.body;
  plant.lastUpdate = new Date();

  //because working with objects, don't need to check for existance of plant in garden
  //if new then this will add to garden, otherwise will update whatever properties changed
  garden[plant.name] = plant;  

  res.send(garden);
});

app.get('/', function(req,res){
   // res.send("Welcome to Nathaniel's Plant Monitoring System");
   res.sendFile(__dirname + '/public/index.html');
   // res.status(200).render('/public/index.html')
   // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});

// Change the status of LED via API based on parameters sent by Button
app.get('/led/:state', function (req, res) {
    res.send('Status ' + req.params.state);
});

app.get('/garden', function (req, res) {
    res.send(garden);
});

// CREATE SERVER
app.listen(port, function(){
 console.log('Server started, listening on port: ',port);
});


function containsObject(childObj, parentObj){
  var o;
  for(o in parentObj){
    if(parentObj.hasOwnProperty(o) && parentObj[o] === childObj){
      return true;
    }
  }

  return false;
}

//http.createServer(function (req, res) {
//  res.setHeader('Content-Type', 'text/html');
//  res.write('<pre>logging button presses:\n');
//  write_stream.pipe(res);
//}).listen(8080);
