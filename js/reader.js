//depends on reader-reader.js

var currentPage = 0;

window.addEventListener('keydown',function(k){
    switch(currentPage) {
        case 0: mainK(k); break;
        case 1: jumpToK(k); break;
    }
    navbarUpdate();
});

window.addEventListener('keyup',function(k){
    switch(currentPage) {
        case 0: mainKup(k); break;
    }
});


var movementHoldLoopActive = false;
function movementHoldLoop(fromto) {
    if(movementHoldLoopActive && !fromto) {
        return;
    } else {
        movementHoldLoopActive = true;
        if(directionalsHeld.length === 0) {
            movementHoldLoopActive = false;
            return;
        }

        var trxamnt = 5,
        change = {
            '2': {d: 'y', c: -1},
            '4': {d: 'x', c: -1},
            '6': {d: 'x', c: 1},
            '8': {d: 'y', c: 1}
        };

        for(var i = 0; i < directionalsHeld.length; i++) {
            var cd = directionalsHeld[i];
            if(cd in change) {
                var cva = 'viewimgtranslate' + change[cd].d;
                window[cva] += trxamnt * change[cd].c;
                window[cva] = Math.min(
                    100,Math.max(
                        0,
                        window[cva]
                    )
                );
            }
        }

        movementUpdate();
        updatePososd();
        pososdShow();
        setTimeout(function(){movementHoldLoop(true)},1000/10);
    }
}

function movementUpdate(){
    display.style.left = viewimgtranslatex + '%';
    display.style.top = viewimgtranslatey + '%';
    display.style.transform = 'translate(' + (viewimgtranslatex * -1) + '%,' + (viewimgtranslatey * -1) + '%)';
    display.style.width = viewimgscale + '%';
}

function pageSwitch(forward) {
    var newurl = false;

    if(!inited) {return false;}

    
    var ess = !!displayend.style.display;
    displayend.style.display = null;
    displaycont.style.display = null;

    switch(typeof(forward)) {
        case 'boolean': 
            if(harddisk.getItem('pageTurnDirRight') === '1') {
                forward = !forward;
            }

            var nextpage = current + (-1 + (forward * 2));

            console.log(nextpage);

            if(nextpage in chapterPages) {
                if(
                    !forward && 
                    !!ess
                ) {
                    return false;
                } else if(!chapterPages[nextpage].blob && hashproced.type === 1 /* is archive */) {
                    toastmsg('Pages are still loading...');
                    return false;
                }
            } else {
                if(nextpage === chapterPages.length) {
                    displayend.style.display = 'block';
                    displaycont.style.display = 'none';
                }
                return false;
            }

            break;
        case 'number': 
            var nextpage = forward;
            if(!(nextpage in chapterPages)) {
                console.error('pageSwitch: requested page does not exist. ' + `(${nextpage} not in chapterPages)`);
                toastmsg('That page does not exist...',{bg: '#900',fg:'#fff',time:2500});
                return false;
            }
            break;
        default:
            console.error('pageSwitch: recieved invalid type on input. ' + `(Got type ${typeof(forward)})`);
            return false;
    }

    current = nextpage;
    newurl = URL.createObjectURL(chapterPages[current].blob || chapterPages[current]);
    URL.revokeObjectURL(display.src);
    displayurl = newurl;
    display.remove();
    display = document.createElement('img');
    display.id = 'page';
    display.src = 'img/blank.png';
    display.src = displayurl;
    displaycont.appendChild(display);

    if(harddisk.getItem('snapOn') === '1') {
        cornerPos(
            harddisk.getItem('defaultSnapX') === '1',
            harddisk.getItem('defaultSnapY') === '1'
        );
        updatePososd();
        pososdShow();
    } else {   
        movementUpdate();
    }

    updatePageOSD();

    return true;

}

function updateClock() {
    trosd.textContent = timedateformat();
}

function updatePageOSD() {
    var progressRightSide = '',
    progressRightSideWrapper = (s)=>{return '<br><span style="font-size:small">' + s + '</span>'}
    showLoadingDetails = harddisk.getItem('showLoadingDetails') === '1';
    if(
        (chapterPages.length !== chapterPagesLoaded) && 
        hashproced.type === 1
    ) {
        var clp = Math.floor((chapterPagesLoaded/chapterPages.length)*100);
        updateLoadingBar(clp);
        if(showLoadingDetails) {
            progressRightSide = `Load ${chapterPagesLoaded}/${chapterPages.length} (${clp}%)`;
        }
    } else if(
        showLoadingDetails &&
        !pageload.done &&
        hashproced.type !== 1
    ) {
        progress.innerHTML = 'Loading...' + progressRightSideWrapper(`Found ${chapterPages.length} files`);
        return;
    }
    progress.innerHTML = (current + 1) + '/' + chapterPages.length + progressRightSideWrapper(progressRightSide);
}

function cornerPos(tol,tot) { //to left, to top
    if(tol) {
        viewimgtranslatex = 100;
    } else {
        viewimgtranslatex = 0;
    }
    if(tot) {
        viewimgtranslatey = 100;
    } else {
        viewimgtranslatey = 0;
    }

    display.style.left = viewimgtranslatex + '%';
    display.style.top = viewimgtranslatey + '%';
    display.style.transform = 'translate(' + (viewimgtranslatex * -1) + '%,' + (viewimgtranslatey * -1) + '%)';
    display.style.width = viewimgscale + '%';
}


function displayScale(closer) {
    if(closer !== undefined) {
        var change = 10;
        if(!closer) {
            change = -10;
        }

        viewimgscale = Math.min(Math.max(viewimgscale + change,50),400);

        display.style.width = viewimgscale + '%';
    }

    zoomosd.innerHTML = viewimgscale.toFixed(0) + '%';
    zoomosd.style.display = null;
    this.clearTimeout(zoomosdTO);
    zoomosdTO = setTimeout(displayScaleTOact, 2500);

    updatePososd();
}

function zoomosdHide() {
    zoomosd.style.display = 'none';
}

function displayScaleTOact() { 
    if(harddisk.getItem('osdShowMode') !== '1') {
        zoomosdHide();
    }
}

function updatePososd() {

    pososd.style.left = viewimgtranslatex + '%';
    pososd.style.top = viewimgtranslatey + '%';
    pososd.style.transform = 'translate(' + (viewimgtranslatex * -1) + '%,' + (viewimgtranslatey * -1) + '%)';

    eid('pososd-x').style.left = viewimgtranslatex + '%';
    eid('pososd-x').style.top = viewimgtranslatey + '%';

    var inhet = screen.availHeight * 0.1, inwid = screen.availWidth * 0.1, aspect = display.width / display.height;

    var curdiswid = inhet * aspect;

    eid('pososd').style.width = curdiswid + 'px';

    var maxscale = 200, minscale = 100;

    if(viewimgscale <= maxscale) {
        var vistemp = viewimgscale;
        if(viewimgscale < minscale) {
            pososd.style.background = 'rgba(255,0,0,0.5)';
        } else {
            pososd.style.background = null;
        }
    } else {
        var vistemp = maxscale;
        pososd.style.background = 'rgba(255,255,0,0.5)';
    }
    pososd.style.width = 150 - (vistemp * 0.5) + '%';
    pososd.style.height = (curdiswid * (inhet / inwid)) * ((150 - (vistemp * 0.5)) / 100) + 'px';
    //pososd.style.height = 150 - (viewimgscale * 0.5) + '%';


}

function pososdShow() {
    eid('pososd').style.display = null;
    pososd.style.display = null;
    clearTimeout(updatePososdTO);
    updatePososdTO = setTimeout(updatePososdTOact, 2500);
}


function updatePososdTOact() {
    if(harddisk.getItem('osdShowMode') !== '1') {
        pososdHide();
    }
}
function pososdHide() {
    eid('pososd').style.display = 'none';
}

function osdToggle() {
    if(harddisk.getItem('osdShowMode') === '1') {
        if(!eid('pososd').style.display) {
            pososdHide();
            zoomosdHide();
            return;
        }
        updatePososd();
        pososdShow();
        displayScale();
    }
}

function navbarUpdate() {
    var l = r = c = '';
    switch(currentPage) {
        case 0: updateNavbarOut(['fullscreen','','jump']); break;
        case 1: updateNavbarOut(['cancel']); break;
    }
}