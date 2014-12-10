this.expressions = [
    {
        expression : new RegExp("^app://index$"),
        fn : function(result) {
            result.window.loadUrl(result.carstenUrl + '/apps/index/index.html?channel=' + result.channel.substr(1));
        }
    },
    {
        expression : new RegExp("^app://github$"),
        fn : function(result) {
            result.window.loadUrl(result.carstenUrl + '/apps/github/index.html');
        }
    },
    {
        expression: new RegExp("^app://9gag$"),
        fn: function (result) {
            result.window.loadUrl(result.carstenUrl + '/apps/9gag/index.html');
        }
    },

];