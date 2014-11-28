this.expressions = [
    {
        expression : new RegExp("^app://index$"),
        fn : function(result) {
            console.log(result.channel);
            console.log(result.channel.substr(1));
            result.window.loadUrl(result.path.normalize('http://localhost:3000/apps/index/index.html?channel=' + result.channel.substr(1)));
        }
    },
    {
        expression : /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
        fn : function(result) {
            result.window.loadUrl('http://www.youtube.com/embed/' + result.match[7] + '?hd=1?&autoplay=1&rel=0&showinfo=0&disablekb=1&controls=0&modestbranding=1');
        }
    },
    {
        expression : /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/,
        fn : function(result) {
            result.window.loadUrl('http://f.vimeocdn.com/p/flash/moogaloop/6.0.22/moogaloop.swf?clip_id=' + result.match[5] + '&color=00adef&fullscreen=1&autoplay=1&server=vimeo.com&show_byline=1&show_portrait=0&show_title=1&controller=player2&view=moogaloop_swf&cdn_url=http%3A%2F%2Ff.vimeocdn.com&player_url=player.vimeo.com&moogaloop_type=moogaloop');
        }
    }
];