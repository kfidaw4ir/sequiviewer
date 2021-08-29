var libitem, libitemcur = 0, hiddenprog = 0;

//harddisk initing
if(harddisk.getItem('bookmarks') === null) {
    harddisk.setItem('bookmarks','{}');
}

window.addEventListener('keydown',keyhandle);
function keyhandle(k) {
    switch(k.key) {
        case 'ArrowUp':
            k.preventDefault();
            librarynavigate(true);
            break;
        case 'ArrowDown':
            k.preventDefault();
            librarynavigate(false);
            break;
        case 'ArrowRight': //forward letter
            navigateletter(1);
            break;
        case 'ArrowLeft':
            navigateletter(-1);
            break;
        case 'Enter':
            if(libitem) {
                if(libitem.length > 0) {
                    window.location = 'chapterlist.html#' + encodeURIComponent(document.activeElement.dataset.targetname);
                } 
            }
            break;
        case 'SoftRight':
            window.location = 'settings.html';
            break;
        case "7":
            if(hiddenprog === 0) {hiddenprog++;}
            break;
        case "1":
            if(hiddenprog === 1) {hiddenprog++;}
            break;
        case "8":
            if(hiddenprog === 2) {
                if(hidden) {
                    window.location = 'index.html';
                } else {
                    window.location = 'index.html#hidden';
                    window.location.reload();
                }
            }
    }
}
function librarynavigate(up) {
    if(up) {
        if(libitemcur > 0) { 
            libitemcur--; 
        } else {
            libitemcur = libitem.length - 1;
        }
    } else {
        if(libitemcur < libitem.length - 1) { 
            libitemcur++; 
        } else {
            libitemcur = 0;
        }
    }
    resetfocus();
}

var navigateletterosdto = 0;
function navigateletter(change) {
    var ltrind = 0;
    for(var i = 0; i < letters.length; i++) {
        if(letters[i].index > libitemcur) {continue;} //skip others
        ltrind = letters[i].index;
    }

    if(ltrind + change in letters) {
        var nwcr = letters[ltrind + change].index;
        var nwin = ltrind + change;
    } else {
        var nwcr = false;
        var nwin = false;
    }

    //console.log(ltrind + change + ' // ' + letters.length);

    //var nwin = Math.min(0, Math.max(letters.length - 1, ltrind + change));

    //console.log(nwin)

    //libitemcur = nwin;

    if(change > 0) {
        libitemcur = nwcr || letters[0].index;
        nwin = nwin || letters[0].index;
    } else {
        if(nwin === false) { //special case bc js treats 0 as falsyyy
            nwin = letters[letters.length - 1].index;
            libitemcur = letters[letters.length - 1].index;
        } else {
            libitemcur = nwcr;
        }
    }

    eid('letter').textContent = letters[nwin].letter;

    clearTimeout(navigateletterosdto);
    eid('lettercont').style.opacity = 1;
    navigateletterosdto = setTimeout(function(){
        eid('lettercont').style.opacity = 0;
    },1000);

    resetfocus();
}

function resetfocus() {
    libitem[libitemcur].focus();
    libitem[libitemcur].scrollIntoView(false);
}