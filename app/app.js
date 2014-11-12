var http          = require('http');
    http.post     = require('http-post');
var url           = require('url');
var app           = require('app');
var path          = require('path');
var BrowserWindow = require('browser-window');

// some configs
var config = {};
config.carstenUrl = process.env.CARSTEN_URL || 'http://localhost:3000';
config.carstenProxy = process.env.HTTP_PROXY;
config.channel = process.env.CHANNEL || '#global';

// which plugins, which path
config.plugins = [{name:'index'}, {name:'system'}, {name:'url'}];
if(process.platform === 'win32') {
  config.pluginPath = './plugins';
} else {
  config.pluginPath = '../../../../../app/plugins';
}

console.log(__dirname);
console.log(path.join(__dirname, '../../../../app/plugins'));

// load plugins
config.plugins.forEach(function(plugin) {
    plugin.app = require(config.pluginPath + '/' + plugin.name + '/' + plugin.name);
    console.log('Plugin loaded: ' + plugin.name );
});

require('crash-reporter').start();
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  var currentUrl;
  var newUrl;
  var options = {};
  var mainWindow = new BrowserWindow({width: 800, height: 600 /*fullscreen: true, "skip-taskbar": true*/ });
  //mainWindow.openDevTools(); .maximize(); .capturePage(); .reload();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });


  console.log('CARSTEN_URL: ' + config.carstenUrl);
  console.log('http_proxy: ' + config.carstenProxy);



  if(config.carstenProxy === undefined)
  {
    options = 
      {
        hostname: url.parse(config.carstenUrl).hostname,
        port: url.parse(config.carstenUrl).port,
        method: 'GET',
        timeout: 5000000
      };
  }
  else
  {
    options = {
      hostname: url.parse(config.carstenProxy).hostname,
      port: url.parse(config.carstenProxy).port,
      path: config.carstenUrl + '/rest/carst',
      headers: {
          Host: url.parse(config.carstenUrl).hostname
        },
      timeout: 5000000
    };
  }

  function handleUserInput(input) {
    var matched = false;
    config.plugins.forEach(function(plugin) {
      plugin.app.expressions.forEach(function(expression) {
        if(!matched) {
          console.log(expression.expression);
          var match = input.match(expression.expression);
          if(match) {
            expression.fn({
              window: mainWindow,
              path: path,
              url: input,
              match: match
            });
            matched = true;
          }
        }
      });
    });
  }

  function register() {

    var data = {
      channel: config.channel
    };

     var options = {
     host: url.parse(config.carstenUrl).hostname,
     port: url.parse(config.carstenUrl).port,
     path: '/rest/init'
     };

    http.post(options, data, function(res) {
      requestCarst();
      requestCommand();
    });

  }

  register();

  //poll for new urls
  function requestCarst() {
    options.path = '/rest/carst';
    var req = http.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function(){
        var url = JSON.parse( data ).url;
        if(currentUrl !== url) {
          handleUserInput(url);
          currentUrl = url;
        }
        requestCarst();
      });
    });
    req.end();
    req.on('error', function (e) {
      console.error(e);
    });
  }



  //poll for new commands
  function requestCommand() {
    options.path = '/rest/command';
    var req = http.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function(){
        var command = JSON.parse( data ).command;
          handleUserInput(command);
        requestCommand();
      });
    });
    req.end();
    req.on('error', function (e) {
      console.error(e);
    });
  }

});