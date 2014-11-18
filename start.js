var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout); }

var path;

if(process.platform === 'win32') {
    path = ".\\release\\atom.exe .\\app\\app.js";
} else {
    path = "release/Atom.app/Contents/MacOS/Atom app/app.js";
}

exec(path, puts);