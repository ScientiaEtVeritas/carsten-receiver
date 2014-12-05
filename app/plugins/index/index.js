this.expressions = [
    {
        expression : new RegExp("^app://index$"),
        fn : function(result) {
            result.window.loadUrl(result.carstenUrl + '/apps/index/index.html?channel=' + result.channel.substr(1));
        }
    },
    {
        expression : new RegExp("^file://(.*)"),
        fn : function(result) {
            result.window.loadUrl(result.carstenUrl + '/image/' + result.match[1]);
        }
    },
    {
        expression : new RegExp("^app://gag$"),
        fn : function(result) {
            result.window.loadUrl(result.carstenUrl + '/apps/gag/index.html');
        }
    },
    {
        expression : /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
        fn : function(result) {
            result.window.loadUrl('http://www.youtube.com/embed/' + result.match[7] + '?hd=1?&autoplay=1&rel=0&showinfo=0&disablekb=1&controls=0&modestbranding=1&iv_load_policy=3');
        }
    },
    {
        expression : /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/,
        fn : function(result) {
            result.window.loadUrl('https://player.vimeo.com/video/' + result.match[5] + '?autoplay=1&badge=0&byline=0&portrait=0');
        }
    }
];