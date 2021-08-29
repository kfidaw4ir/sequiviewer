var harddisk = localStorage;
if(harddisk.getItem('firstrun') === null) {
    //this also means that everything else isn't set
    harddisk.setItem('firstrun','1');

    harddisk.setItem('snapOn','0'); //for page autosnap to corner: 0/1
    harddisk.setItem('defaultSnapX','1'); //left/right
    harddisk.setItem('defaultSnapY','0'); //top/bottom
    harddisk.setItem('pageTurnDirRight','0'); //for page turn direction: left or right: 0/1
    harddisk.setItem('volKeyPageTurn','0'); //volume keys for page turning
    harddisk.setItem('labelArchive','1'); //label archives on chapter page
    harddisk.setItem('labelFolder','0'); //same as above for folders
    harddisk.setItem('showClock','1'); //for clock
    harddisk.setItem('showLoadingBar','1');
    harddisk.setItem('showLoadingDetails','0'); 
    harddisk.setItem('osdShowMode','1'); //0 = toggle, 1 = timeout

    //create color for top bar for first time users
    //some devices show color white instead of color black for default
    var tpclr = document.createElement('meta');
    tpclr.name = 'theme-color';
    tpclr.content = '#000000';
    document.body.appendChild(tpclr);


    //<meta name="theme-color" content="#000000" />

    setTimeout(tuconf,100);

} else {
    window.location = 'index.html';
}

function tuconf(){
    if(window.confirm('Would you like to view the tutorial?\n(You can view it later.)')) {
        window.location = 'tutorial.html';
    } else {
        window.location = 'index.html';
    }
}