#!/usr/local/bin/node

var fs = require('fs');
var http = http = require('http')
var bunyan = require('bunyan')
var Router = require('node-simple-router') //https://github.com/sandy98/node-simple-router
var router = Router({'logging': false});
var mkdirp = require('mkdirp');
//###############################
function uptime(format)  {
  var seconds = process.uptime()
  var numyears = Math.floor(seconds / 31536000);
  var numdays = Math.floor((seconds % 31536000) / 86400); 
  var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
  var uptime = numyears + " years " +  numdays + " days " + numhours + " hours " + numminutes + " minutes " + parseInt(numseconds) + " seconds";
  if (format === 'plain') {
    return uptime + "\n\n";
  }
  if (format === 'html') {
    var html="<center><h1><strong>" +
    uptime +
    "</center></h1></strong>";
    return html;
  }
  else {
    return uptime + "\n\n"
  }
}
//###############################

var makeDirs = function (dirs){
  dirs.map(function(d){
      mkdirp(d, function(err){});
  })
}
var dirs = ['log','tmp','public']
makeDirs(dirs)
//###############################

// Write out the banner to the console
var banner = function () {
  fs.readFile('banner.txt', function (err, data) {  
    if (err) throw err; 
    var banner = data.toString();
   if (banner) {
    fill = Array(process.stdout.columns).join("#")
    console.log("%s%s%s",fill,banner,fill); return banner }
  });
}
//###############################
banner();
// Configure Logging
var loggerConfig = {
  name: 'nodejs-boilerplat-server',
  streams: [
    {
      level: 'info',
      stream: process.stdout,        
    },
    {
      level: 'info',
      path: 'log/access.log',          
    },
    {
      level: 'error',
      path: 'log/error.log'  
    },
    {
      level: 'error',
      stream: process.stdout,   
    }
  ]
}
var log = bunyan.createLogger(loggerConfig);
var server = http.createServer(router);
//###############################

function logRequests(server) {
  var logRequest = function (req) {
    log.info(bunyan.stdSerializers.req(req));
  }
  server.on('request', logRequest)
}
//logRequests(server);
server.on('error', function(e) {log.error(e);});
server.listen(8080)
//###############################

var routerConfig = function (router) {
  router.get('/banner', function (request, response) {
    fs.readFile('banner.txt', function (err, data) {
      if (err) throw err;
      response.end(data.toString());
    });
  });
  router.get('/uptime',function(req,res){
    res.writeHead(200,{'content-type':'text/html'})
    res.end(uptime('html'));  
  })  
}
routerConfig(router);
//###############################
