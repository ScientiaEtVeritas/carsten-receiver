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
    }
];