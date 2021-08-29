var 
sdcard = navigator.getDeviceStorage('sdcard'), 
pageload = {}, //will be set later.
hashproced = JSON.parse(decodeURIComponent(location.hash).substr(1)), 
chapterPages = [], //will be populated later.
chapterPagesLoaded = 0, //only used for zip file loading.
current = 0,
display = eid('page'),
displayurl = '',
progress = eid('progress'),
zoomosd = eid('zoomosd'),
trosd = eid('toprightosd'),
hider = eid('hide'),
zoomosdTO = setTimeout(displayScaleTOact, 2500), //set the initial timeout to hide the stuff
displaycont = eid('pagecont'),
displayend = eid('pageend'),
inited = false,
pososd = eid('pososd-in'),
updatePososdTO = setTimeout(updatePososdTOact,2500), //set the initial timeout to hide the stuff
osdautohide = false,
directionalsHeld = [],
pageTurnDisabled = true,
jszip = new JSZip(), //jszip: only used for reading :( 

errorMessages = {
    archiveNoFiles: 'Zip extractor found no files.<ul style="text-align:left;"><li>Is your archive empty?</li><li>Is your archive in CBZ/ZIP format? (RAR, 7Z not supported)</li></ul>',
    noFilesWithNumber: 'No valid files found!<br>Files must be numbers *only*!<ul style="text-align:left;"><li>⭕ OK: 001.png</li><li>❌ NG: Page_001.png</li></ul>'
}
;

header.innerHTML = '#' + parseFloat(hashproced.chapter) + ' - ' + hashproced.name; //Note!!!!!!! hashproced.chapter might not be a valid number!!

//load event listener has been moved to the bottom.

function showerror(msg) {
    hider.innerHTML = '<div><b>An Error Occured!</b><p>' + msg + '</div>';
    //hider.style.display = null;
    hider.classList.add('showerror');
}

function sortpages() {
    //sort now
        //var dbgChRm = [];
        for(var i = 0; i < chapterPages.length;) {
            if(isNaN(
                hashproced.archive? parseFloat(chapterPages[i].name) : parseFloat(isolateFileName(chapterPages[i].name))
            )) {
                chapterPages.splice(i,1);
                //dbgChRm.push(chapterPages.splice(i,1)[0]);
            } else {
                i++;
            }
        }

        if(chapterPages.length === 0) {
            showerror(errorMessages.noFilesWithNumber);
            progress.textContent = 'Error';
            throw 'No valid files found. Aborted.';
        }
        //console.log(dbgChRm);
        chapterPages.sort((a,b)=> {
            var
            first = isolateFileName(a.name),
            second = isolateFileName(b.name);

            return parseFloat(first) - parseFloat(second); 


            /* if(!isNaN(parseFloat(first)) && !isNaN(parseFloat(second))) {
                return parseFloat(first) - parseFloat(second); 
            } else {
                //fallback to alphabet sort
                if(a < b) {return -1}
                if(a > b) {return 1}
                return 0;
            } */
        });
}

function archiveloaded() {
    jszip.loadAsync(pageload.result)
        .catch(function(err){
            console.error(err);
            showerror(errorMessages.archiveNoFiles);
        })
        .then(function(zip){
            var zipf = zip.files;
            //var zipfk = Object.keys(zipf);
            for(var fil of Object.keys(zipf)) {
                chapterPages.push({
                    name: fil,
                    blob: null
                });
            }

            
            //progress.textContent = 'Loading...';
            sortpages();
            
            archivefilep();

        });
}

function archivefilep() {
    jszip.files[chapterPages[chapterPagesLoaded].name].async('blob').then(function(bl){
        //console.log('read');
        chapterPages[chapterPagesLoaded].blob = bl;

        chapterPagesLoaded++;
        //console.log(chapterPagesLoaded === chapterPages.length);

        if(chapterPagesLoaded === 1) { //if we loaded the first one
            pageload = {}; //reset it for next function
            inited = true;
            scanner();
        }

        updatePageOSD();
        //progress.textContent = (current + 1) + '/' + chapterPagesLoaded;
        //eid('loadingosd').innerHTML = 'Loading pages:<br>' + chapterPagesLoaded + ' of ' + chapterPages.length;

        if(chapterPagesLoaded === chapterPages.length) { 
            //finalize
            jszip = undefined;
            updateLoadingBar(100);
            //eid('loadingosd').style.display = 'none';
        } else {
            archivefilep(); //it's like continue() for devicestorage enumerate objects.
            // it is not recursive; it runs in a then()
        }
    });
}

function scanner() {
    if(pageload.result !== undefined) {
        if(pageload.result.type.indexOf('image') > -1) {
            chapterPages.push(pageload.result);
            updatePageOSD();
            pageload.continue();
        }
    } else {
        sortpages();

        display.src = URL.createObjectURL(chapterPages[0].blob || chapterPages[0]);
        //progress.textContent = (current + 1) + '/' + (chapterPagesLoaded || chapterPages.length);
        updatePageOSD();
        inited = true;
        if(!hashproced.archive) {updateLoadingBar(100);}
    }
}
function updateLoadingBar(wid) {
    if(harddisk.getItem('showLoadingBar') === '1') {

        eid('loading-bar').style.width = wid + '%';
        eid('loading-bar').classList.remove('hidden');
        if(wid >= 100) {
            eid('loading-bar').style.animation = 'fadeout 1s forwards';
        }
    }
}


window.addEventListener('load', function(){
    //console.log('start');
    if(hashproced.archive) {
        //console.log('is archive');
        pageload = sdcard.get(pathprefix + '/' + hashproced.target + '/' + hashproced.chapter + '.cbz');
        pageload.onsuccess = archiveloaded;
    } else {
        //console.log('not archive');
        pageload = sdcard.enumerate(pathprefix + '/' + hashproced.target + '/' + hashproced.chapter + '/');
        pageload.onsuccess = scanner;
        //eid('loadingosd').style.display = 'none';
    }
    navigator.requestWakeLock('screen');

    if(
        harddisk.getItem('osdShowModeToggleDefault') === '1' &&
        harddisk.getItem('osdShowMode') === '1'
    ) {
        osdToggle();
    }

    if(hashproced.hidden) {
        window.addEventListener('blur',function(){
            hider.classList.remove('hidden')
        })
    }
    display.addEventListener('load',function(){
        updatePososd();
    });
        

    if(harddisk.getItem('showClock') === '1') {
        updateClock();
        setInterval(updateClock,1000);
    }
});
