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
    }
];