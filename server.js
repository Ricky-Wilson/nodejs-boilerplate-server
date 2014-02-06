var fs = require('fs');
var http = http = require('http')
var bunyan = require('bunyan')
var Router = require('node-simple-router') //https://github.com/sandy98/node-simple-router
var router = Router({'logging': false});
var mkdirp = require('mkdirp');

var makeDirs = function (dirs){
  dirs.map(function(d){
      mkdirp(d, function(err){});
  })
}
var dirs = ['log','tmp']
makeDirs(dirs)

// Write out the banner to the console
var banner = function () {
  fs.readFile('banner.txt', function (err, data) {  
    if (err) throw err; 
    var banner = data.toString();
   if (banner) {console.log(banner); return banner }
  });
}

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
function logRequests(server) {
  var logRequest = function (req) {
    log.info(bunyan.stdSerializers.req(req));
  }
  server.on('request', logRequest)
}
//logRequests(server);
server.on('error', function(e) {log.error(e);});
server.listen(8080)

var routerConfig = function (router) {
  router.get('/banner', function (request, response) {
    fs.readFile('banner.txt', function (err, data) {
      if (err) throw err;
      response.end(data.toString());
    });
  });
  
}

routerConfig(router);
