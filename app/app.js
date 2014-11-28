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
config.plugins = [{name:'control'}, {name:'index'}, {name:'system'}, {name:'url'}];
if(process.platform === 'win32') {
  config.pluginPath = './plugins';
} else {
  config.pluginPath = '../../../../../app/plugins';
}

var consolePlugins = '';

// load plugins
config.plugins.forEach(function(plugin) {
    plugin.app = require(config.pluginPath + '/' + plugin.name + '/' + plugin.name);
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
  var mainWindow = new BrowserWindow({width: 800, height: 600 /*fullscreen: true, "skip-taskbar": true*/ });
  //mainWindow.openDevTools(); .maximize(); .capturePage(); .reload();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  function getRequestOptions(path, method, param) {
    param = param || '';
    if(config.carstenProxy === undefined)
    {
      options =
      {
        hostname: url.parse(config.carstenUrl).hostname,
        port: url.parse(config.carstenUrl).port,
        path: path + '/' + param,
        method: method,
        headers:{"User-Agent":"foobar/1.0"}
      };
    }
    else
    {
      options = {
        hostname: url.parse(config.carstenProxy).hostname,
        port: url.parse(config.carstenProxy).port,
        path: config.carstenUrl + path + '/' + param,
        method: method,
        headers: {
          "User-Agent":"foobar/1.0",
          Host: url.parse(config.carstenUrl).hostname
        }
      };
    }

    return options;
  }

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
  /*  mainWindow.webContents.on('did-finish-load', function() {
      function tmp () {
        /*var div = document.createElement("div");
        div.style.position = "fixed";
        div.style.bottom = "50px";
        div.style.right = "50px";
        div.style.height = "75px";
        div.style.width = "200px";
        div.style.backgroundColor = "#ffffff";
        div.appendChild(document.createTextNode("<span style='font-size:3em;'>Zeit läuft ab...</span>"));
        document.body.appendChild(div);*/
        /*var $div = $("<div style='position:fixed;bottom:25px;right:25px;height:100px;width:250px;background-color:white;'> <div style='text-align:center;'>" +
       "<div class='head-circle' style='z-index:0;'>"+
       "<div style='position: absolute; left:30px; z-index:2;' class='heading'>Carsten &#10084;</div>"+
        "<div style='width: 60px; height:60px; background-color:#FBDFC9; position: absolute; left:100px; top:75px; border-radius:60px; z-index:1;'></div>"+
          "<div style='width: 60px; height:60px; background-color:#FBDFC9; position: absolute; right:100px; top:75px; border-radius:60px; z-index:1;'></div>"+
          "<p style='z-index:2; position: absolute; top:150px; font-style: italic;'>" +
          "With Carsten you can <strong>carst</strong> content to screens within your network.<br>"+
          "</p></div> </div>Zeit läuft ab...</div>");
        $('body').append($div);
      }
      console.log(tmp.toString());
      mainWindow.webContents.executeJavaScript('(' + tmp.toString() + ')();'); */
      //  mainWindow.capturePage(function(image) {
      //    console.log(image.toString('base64'));
      //  });
    /*});*/
  }

  function register() {

    var data = {
      channel: config.channel,
      hostname: config.receiverName
    };

    var options = getRequestOptions('/rest/init', 'POST');

    data = JSON.stringify(data);

    options.headers['Content-Type'] = 'application/json';
    options.headers['Content-Length'] = data.length;

    console.log(options);
    console.log(data);

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on("data", function(chunk) {
        try {
          chunk = JSON.parse( chunk );
          if(chunk.status) {
            console.log("REGISTRATION SUCCESSFULLY");
            requestCarst();
            requestCommand();
          } else {
            console.log("REGISTRATION ERROR: " + chunk.message);
          }
        } catch(e) {
          console.log('\n*----- FATAL REGISTRATION ERROR -----*\n' +
          e + '\n\n' +
          chunk);
        }
      });
    });
    req.write(data);
    req.end();
  }

  register();

  function requestCarst() {
    var options = getRequestOptions('/rest/carst', 'GET', config.receiverName);
    var req = http.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function(){
        try {
          var carst = JSON.parse( data );
          handleUserInput(carst);
        } catch(e) {
          console.log('\n*-------- ERROR --------*\n' +
          e + '\n\n' +
          data);
        }
        requestCarst();
      });
    });
    req.on('error', function (e) {
      if(e.code === 'ECONNRESET') {
        console.log('ECONNRESET --- RECONNECTING');
        requestCarst();
      } else {
        console.error(e);
      }
    });
    req.end();
  }

  function requestCommand() {
    var options = getRequestOptions('/rest/command', 'GET', config.receiverName);
    var req = http.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function(){
        try {
          var command = JSON.parse( data );
          handleUserInput(command);
        } catch(e) {
          console.log('\n*-------- ERROR --------*\n' +
              e + '\n\n' +
              data);
        }
        requestCommand();
      });
    });
    req.on('error', function (e) {
      if(e.code === 'ECONNRESET') {
        console.log('ECONNRESET --- RECONNECTING');
        requestCommand();
      } else {
        console.error(e);
      }
    });
    req.end();
  }
});