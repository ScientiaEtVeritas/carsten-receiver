var http_req = require('http');
var url = require('url');

require('node-shell')(function(err, api) {  
  var mainWindow = new api.BrowserWindow({width: 800, height: 600 });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });


  var carstenUrl = process.env.CARSTEN_URL || 'http://localhost:3000';
  var currentUrl = undefined;
  var newUrl     = undefined;

  var options = 
    {
      hostname: url.parse(carstenUrl).hostname, 
      port: url.parse(carstenUrl).port,
      path: '/rest/carst',
      method: 'GET'
    };

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