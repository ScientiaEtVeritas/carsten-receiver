this.expressions = [
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
            result.window.loadUrl(result.path.normalize('file://' + __dirname + '/error.html'));
        }
    }
];