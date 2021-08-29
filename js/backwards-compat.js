function bookmarkConvert() {
    var ob = harddisk.getItem('bookmarks');
    if(ob) {
        window.alert('Your bookmarks will be converted from the old system to the new system.');
        var tb = JSON.parse(ob),
        wns = Object.keys(tb);
        for(var i = 0; i < wns.length; i++) {
            var wn = wns[i];
            harddisk.setItem('bookmarks-' + wn,JSON.stringify({
                read: [],
                last: tb[wn]
            }));
        }
    }
}