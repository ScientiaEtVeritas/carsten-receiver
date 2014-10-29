require('node-shell')(function(err, api) {  
  var mainWindow = new api.BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  var carstenUrl = process.env.CARSTEN_URL || 'http://localhost:3000';

  console.log('Connecting to ' + carstenUrl);
  var socket = require('socket.io-client')(carstenUrl);  


  socket.on('error', function (data) {
    console.log('A socket.io error occured');
    console.log(data);
  });

  socket.on('connect_error', function (err) {
    console.log('A socket.io connect_error occured');
    console.log(err);
  });

  socket.on('connect', function (data) {
    console.log('Connected to ' + carstenUrl);

    socket.on('carst', function (data) {  
      console.log('Received carst');
      console.log(data);    
      mainWindow.loadUrl(data.url);
    });

  });

});