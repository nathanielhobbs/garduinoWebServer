"use strict"

var express = require('express');
var app = express();
var settings = require('./settings');
var port = settings.port;
var garden = {};

// set up logging middleware
// var logger = require('morgan');
// app.use(logger('common'));

// set up body parser middleware to handle POST data
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:false}));

//avoid cross domain issues
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// set view engine for rendering 
app.set('view engine', 'ejs');

// body should be of form {"name": xxx,"moisture": xxx}
app.post('/garden', function(req,res) {
  console.log('received post from plant:');
  console.log(JSON.stringify(req.body));
  var plant = req.body;
  plant.lastUpdate = new Date();

  //because working with objects, don't need to check for existance of plant in garden
  //if new then this will add to garden, otherwise will update whatever properties changed
  var key = plant.mac.replace(/:/g, ''); //use mac address (sub colons) as unique key
  garden[key] = plant;  

  console.log("garden is now ", JSON.stringify(garden))

  res.send(garden);
});

app.get('/', function(req,res){
   // res.send("Welcome to Nathaniel's Plant Monitoring System");
   res.sendFile(__dirname + '/public/index.html');
   // res.status(200).render('/public/index.html')
   // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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
