this.expressions = [
    {
        expression : new RegExp("^:index$"),
        fn : function(result) {
            result.window.loadUrl(result.carstenUrl + '/apps/index/index.html?channel=' + result.channel.substr(1));
        }
    },
    {
        expression : new RegExp("^:github$"),
        fn : function(result) {
            result.window.loadUrl(result.carstenUrl + '/apps/github/index.html?channel=' + result.channel.substr(1));
        }
    },
    {
        expression: new RegExp("^:9gag$"),
        fn: function (result) {
            result.window.loadUrl(result.carstenUrl + '/apps/9gag/index.html');
        }
    }

];