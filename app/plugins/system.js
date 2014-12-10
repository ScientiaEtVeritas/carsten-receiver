this.expressions = [
    {
        expression : new RegExp("^maximize$"),
        fn : function(result) {
            result.window.setFullScreen(true);
        }
    },
    {
        expression : new RegExp("^unmaximize$"),
        fn : function(result) {
            result.window.setFullScreen(false);
        }
    },
    {
        expression : new RegExp("^toggleMaximize$"),
        fn : function(result) {
            if(result.window.isFullScreen()) {
                result.window.setFullScreen(false);
            } else {
                result.window.setFullScreen(true);
            }
        }
    },
    {
        expression : new RegExp("^reload$"),
        fn : function(result) {
            result.window.reload();
        }
    },
    {
        expression : new RegExp("^devtools$"),
        fn : function(result) {
            result.window.toggleDevTools();
        }
    },
    {
        expression : new RegExp("^power off$"),
        fn : function(result) {
            var sys = require('sys')
            var exec = require('child_process').exec;

            function puts(error, stdout, stderr) { sys.puts(stdout); }

            var path;

            exec("echo 'standby 0' | cec-client -s", puts);
        }
    },
    {
        expression : new RegExp("^power on$"),
        fn : function(result) {
            var sys = require('sys')
            var exec = require('child_process').exec;

            function puts(error, stdout, stderr) { sys.puts(stdout); }

            var path;

            exec("echo 'on 0' | cec-client -s", puts);
        }
    },
    {
        expression : new RegExp("^file://(.*)"),
        fn : function(result) {
            result.window.loadUrl(result.carstenUrl + '/image/' + result.match[1]);
        }
    },
    {
        expression : /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,})$/,
        fn : function(result) {
            result.window.loadUrl(result.url);
        }
    },
    {
        expression : /^(www\.[^\s]+\.[^\s]{2,})$/,
        fn : function(result) {
            result.window.loadUrl('http://' + result.url);
        }
    },
    {
        expression : /.*/,
        fn : function(result) {
        }
    }
];