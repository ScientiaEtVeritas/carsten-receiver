var http          = require('http');
var url           = require('url');
var app           = require('app');
var path          = require('path');
var BrowserWindow = require('browser-window');

// some configs
var config = {};
config.carstenUrl = process.env.CARSTEN_URL || 'http://localhost:3000';
config.carstenProxy = process.env.HTTP_PROXY;

// which plugins, which path
config.plugins = [{name:'index'}, {name:'system'}, {name:'url'}];
config.pluginPath = './plugins/';

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
        path: '/rest/carst',
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

  //poll for new urls
  function requestCarst() {

    var req = http.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function(){
        var url = JSON.parse( data ).url;
        if(currentUrl !== url) {

          var matched = false;
          console.log(__dirname);

          config.plugins.forEach(function(plugin) {
            plugin.app.expressions.forEach(function(expression) {
              if(!matched) {
                console.log(expression.expression);
                var match = url.match(expression.expression);
                if(match) {
                  expression.fn({
                    window: mainWindow,
                    path: path,
                    url: url,
                    match: match
                  });
                  matched = true;
                }
              }
            });
          });

          currentUrl = url;



          /* var match = url.match(config.plugins[0].app.expressions[1].expression);
           if(match) {
             config.plugins[0].app.expressions[1].fn(mainWindow, url, match);
             currentUrl = url;
           } else {
             mainWindow.loadUrl(url);
             currentUrl = url;
           }*/
        }

        requestCarst();
      });
    });

    req.end();
    req.on('error', function (e) {
      console.error(e);
    });
  }

  requestCarst();

});