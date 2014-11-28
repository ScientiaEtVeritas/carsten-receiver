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
    }
];