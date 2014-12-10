var url           = require('url');
var app           = require('app');
var path          = require('path');
var BrowserWindow = require('browser-window');
var os            = require('os');

// some configs
var config = {};
config.carstenUrl = process.env.CARSTEN_URL || 'http://localhost:3000';
config.carstenProxy = process.env.HTTP_PROXY;
config.channel = process.env.CHANNEL || '#global';
config.receiverName = process.env.RECEIVER_NAME || os.hostname();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var io  = require('socket.io-client');         // this is the socket.io client
var socket    = io.connect(config.carstenUrl + '/receiver');               // connect to second app

var http;
if(/http:\/\//.test(config.carstenUrl)) {
  http = require('http');
} else if(/https:\/\//.test(config.carstenUrl)) {
  http = require('https');
} else {
  console.log('ERROR: Invalid Carsten-URL.');
  process.exit(1);
}

// which plugins, which path
config.plugins = [{name:'apps'}, {name:'system'}];
if(process.platform === 'win32') {
  config.pluginPath = './plugins';
} else {
  config.pluginPath = '../../../../../app/plugins';
}

var consolePlugins = '';

// load plugins
config.plugins.forEach(function(plugin) {
    plugin.app = require(config.pluginPath + '/' + plugin.name);
    consolePlugins += '\nPlugin loaded: ' +  plugin.name;
});

console.log('\n\n********* CONFIGURATION --- START **********\n' +
'\nCARSTEN_URL: ' + config.carstenUrl +
'\nHTTP_PROXY: ' + (config.carstenProxy ? config.carstenProxy : 'no proxy') +
'\nCHANNEL: ' + config.channel +
'\nRECEIVER_NAME: ' + config.receiverName +
'\n' + consolePlugins +
'\n\n********** CONFIGURATION --- END ***********\n\n');

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
  var mainWindow = new BrowserWindow({fullscreen: true, "skip-taskbar": true, "node-integration":false, "web-preferences": {
    plugins:true
  } });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  function handleUserInput(carst) {
    var matched = false;
    config.plugins.forEach(function(plugin) {
      plugin.app.expressions.forEach(function(expression) {
        if(!matched) {
          console.log(expression.expression);
          console.log(carst.url, carst.command);
          var match = carst.url && carst.url.match(expression.expression) || carst.command && carst.command.match(expression.expression);
          if(match) {
            expression.fn({
              carstenUrl: config.carstenUrl,
              window: mainWindow,
              path: path,
              url: carst.url || carst.command,
              channel: carst.channel,
              match: match
            });
            matched = true;
          }
        }
      });
    });
    mainWindow.webContents.on('did-finish-load', function() {
      setTimeout(function() {
        mainWindow.capturePage(function(image) {
          socket.emit('capture', image);
        });
      }, 3000);
      });
  }

    var data = {
      channel: config.channel,
      hostname: config.receiverName
    };

    socket.emit('registerReceiver', data);

    socket.on('registrationSuccessfully', function() {
          console.log("REGISTRATION SUCCESSFULLY");
    });

    socket.on('registrationFailed', function(message) {
      console.error("REGISTRATION ERROR: " + message);
      socket.disconnect();
      process.exit(1);
    });

    socket.on('carst', function (carst) {
      if(carst.channel == config.channel) {
        handleUserInput(carst);
      }
    });

    socket.on('command', function (command) {
      console.log(command.channel, command);
      if(command.channel == config.channel) {
        handleUserInput(command);
      }
    });



});