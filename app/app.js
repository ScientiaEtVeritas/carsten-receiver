var http_req      = require('http');
var url           = require('url');
var app           = require('app');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  var mainWindow = new BrowserWindow({width: 800, height: 600 });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  var carstenUrl = process.env.CARSTEN_URL || 'http://localhost:3000';
  var carstenProxy = process.env.http_proxy;

  console.log('CARSTEN_URL: ' + carstenUrl);
  console.log('http_proxy: ' + carstenProxy);

  var currentUrl = undefined;
  var newUrl     = undefined;

  var options = {};

  if(carstenProxy === undefined)
  {
    options = 
      {
        hostname: url.parse(carstenUrl).hostname, 
        port: url.parse(carstenUrl).port,
        path: '/rest/carst',
        method: 'GET'
      };
  }
  else
  {
    options = {
      hostname: url.parse(carstenProxy).hostname,
      port: url.parse(carstenProxy).port,
      path: carstenUrl + '/rest/carst',
      headers: {
          Host: url.parse(carstenUrl).hostname
        }
      };
  }

  //poll for new urls
  setInterval(function(){

      var req = http_req.request(options, function(res) {
        var data = '';
        res.on('data', function(chunk) { data += chunk; });
        res.on('end', function(){
            newUrl = JSON.parse( data ).url;

            if(newUrl !== currentUrl)
            {
              if( newUrl === undefined)
              {
                mainWindow.loadUrl('file://' + __dirname + '/index.html');
              }
              else
              {
                mainWindow.loadUrl(newUrl);
              }
              currentUrl = newUrl;
              newUrl = undefined;
            }
        });
    });

    req.end();
    req.on('error', function (e) {
        console.error(e);
    });
    
  }, 3000);

});