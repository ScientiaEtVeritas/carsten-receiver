this.expressions = [
    {
        expression : new RegExp("(^.*) -c$"),
        fn : function(result) {
            result.window.loadUrl(result.path.normalize('file://' + __dirname + '/control.html'));
        }
    }, {
        expression : new RegExp("^app://file$"),
        fn : function(result) {
            result.window.loadUrl(result.path.normalize('file://' + __dirname + '/file.html'));
        }
    }, {
        expression : new RegExp("^power off$"),
        fn : function(result) {
            var sys = require('sys')
            var exec = require('child_process').exec;

            function puts(error, stdout, stderr) { sys.puts(stdout); }

            var path;

           exec("echo 'standby 0' | cec-client -s", puts);
        }
    }, {
        expression : new RegExp("^power on$"),
        fn : function(result) {
            var sys = require('sys')
            var exec = require('child_process').exec;

            function puts(error, stdout, stderr) { sys.puts(stdout); }

            var path;

            exec("echo 'on 0' | cec-client -s", puts);
        }
    }
];