var app = require('app');  
var BrowserWindow = require('browser-window'); 

var mainWindow = null;
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {  
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  var socket = require('socket.io-client')('http://localhost:3000');  

  socket.on('carst', function (data) {    
    mainWindow.loadUrl(data.url);
  });

});