this.expressions = [
    {
        expression : new RegExp("^app://index$"),
        fn : function(result) {
            result.window.loadUrl(result.path.normalize('file://' + __dirname + '/index.html'));
        }
    },
    {
        expression : /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
        fn : function(result) {
            result.window.loadUrl('http://www.youtube.com/embed/' + result.match[7] + '?hd=1?&autoplay=1');
        }
    }
];