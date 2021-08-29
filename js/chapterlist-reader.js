var filereader = new FileReader,
    sdcard = navigator.getDeviceStorage('sdcard'),
    libraryscanner,
    chapters = [],
    chaptersTemp = {
        folder: [],
        archive: []
    }
    filesfound = 0,
    //starttime,
    target = decodeURIComponent(location.hash.substr(1)),
    bookmarks = JSON.parse(harddisk.getItem('bookmarks-' + target)) || {read: [], last: null},
    imageexists = false,
    extramdataexists = false,
    extramdataloaded = false,
    loadingout = eid('loadingdisp'),
    bookinfo = {
        "title": eid('bookinfo-title'),
        "author": eid('bookinfo-author'),
        "chapters": eid('bookinfo-chapters'),
        "description": eid('bookinfo-description'),
        "picture": eid('bookinfo-img'),
        "picturebg": eid('bookinfo-img-bg')
    },
    badgePrewritten = {
        unread: badgelist('unread','#252525','#fff',false,'chapter-unread'),
        last: badgelist('last','#ff0','#000','chapter-lastread'),
        cbzFile: badgelist('cbz file','#00a'),
        folder: badgelist('folder','#080')
    };

beginscan();

function beginscan() {
    loadingout.textContent = 'Loading!';
    //starttime = new Date();
    libraryscanner = sdcard.enumerate(pathprefix + '/' + target + '/');
    libraryscanner.onsuccess = function () {
        if (this.result) {
            var fname = this.result.name.substr(this.result.name.indexOf(pathprefix + '/') + pathprefix.length + 1 /* length of the file prefix and '/' */ + target.length + 1);
            //console.log(fname);
            if (fname.indexOf('/') === 0) {
                fname = fname.substr(1)
            }

            //console.log(fname);

            if (fname.indexOf('/') < fname.lastIndexOf('.') && fname.indexOf('/') !== -1) {
                //is folder
                //console.log('detected folder');

                var fnum = fname.substring(0, fname.indexOf('/')), path = fname.substring(0, fname.indexOf('/'));
                if (numinchapter(Number(fnum),1) === -1 && numinchapter(path,1) === -1) { //does the chapter already exist???
                    if (this.result.type.indexOf('image') > -1) { //if this is an image. 
                        //if there is a directory filled with not images, dont count it as a chapter
                        pushtocharray(fnum,path,false);
                    }
                }
            } else { //is file (from folder check)
                //check if is image
                if (this.result.type.indexOf('image') > -1) {
                    if (fname.substring(0, fname.lastIndexOf('.')).toLowerCase() === 'cover') {
                        bookinfo.picturebg.src = bookinfo.picture.src = URL.createObjectURL(this.result);
                        imageexists = true;
                    }
                } else if( //check if is cbz file
                    this.result.name.substring(
                        this.result.name.lastIndexOf('.') - 
                        this.result.name.length + 1 /* +1 bc idk */
                    ).toLowerCase().indexOf('cbz') > -1
                ) {
                    var pn = fname.substring(0, fname.lastIndexOf('.'));
                    var pnnum = Number(pn);
                    if(isNaN(pnnum)) {pnnum = pn;}
                    if (numinchapter(Number(pnnum),2) === -1 && numinchapter(pn,2) === -1) { //does the chapter already exist???
                        pushtocharray(
                            pnnum,
                            pn,
                            true
                        ); //found cbz file, push to array.
                    } else {
                        console.warn('duplicate chapter archive found: ' + pnnum);
                    }
                } else {
                    switch (fname.toLowerCase()) {
                        case 'r18':
                        case 'r18.txt':
                        case 'hidden':
                        case 'hidden.txt':
                            eid('hiddenbadge').style.display = null; //resets to default, block
                            break;
                        case 'metadata':
                        case 'metadata.txt':
                        case 'metadata.json':
                            if(!extramdataexists) {
                                extramdataexists = true;
                                filereader.readAsText(this.result);
                                filereader.onload = function(){
                                    var mda = JSON.parse(filereader.result);
                                    if('author' in mda) {bookinfo.author.textContent = mda.author;}
                                    if('description' in mda) {bookinfo.description.textContent = mda.description;}
                                    if('name' in mda) {bookinfo.title.textContent = header.textContent = mda.name;}
                                    if(libraryscanner.done) {
                                        parseld();
                                    } else {
                                        extramdataloaded = true;
                                    }
                                }
                            } else {
                                console.warn('multiple metadata files are detected; the one i detected first will be used. please delete the unwanted metadata files and keep only one.');
                            }
                        break;
                    }
                }
            }

            loadingout.textContent = 'Loading! ' + ++filesfound + ' files, ' + (chaptersTemp.folder.length + chaptersTemp.archive.length) + ' entries!';

            this.continue();
        } else {
            //done?
            if(!extramdataloaded && extramdataexists) {
                loadingout.innerHTML = 'Waiting for metadata...';
                return;
            }
            parseld();
        }
    }
}

function parseld() {
    loadingout.innerHTML = '';
    //images
    //if(bookinfo.picture.src === '') {
    if(!imageexists) {
        if(eid('hiddenbadge').style.display) { //if is nul
            var tsrc = 'img/cover-placeholder.png';
        } else {
            var tsrc = 'img/hidden-cover-placeholder.png';
        }
        bookinfo.picturebg.src = bookinfo.picture.src = tsrc;
    }

    chapters = chaptersTemp.archive.concat(chaptersTemp.folder);

    //chapters
    if(chapters.length === 0) {
        bookinfo.chapters.innerHTML = 'No chapters available';
        eid('bookchapters').innerHTML = '<center>No chapters.</center>';
        chapteritems = [];
    } else {
        chapters.sort((a,b)=>{
            var na = a.number, nb = b.number;
            if(isNaN(Number(na)) || isNaN(Number(nb))) {
                //use default alphabet sorting if any of them is not a nunmber.
                if(na < nb) {return -1}
                if(na > nb) {return 1}
            } else {
                na = Number(na), nb = Number(nb);
                if(na !== nb) {return Number(na)-Number(nb);}
            }

            //both are the same.
            //the only way for two of them to be the same
            //is if there is an archive and a folder.

            //archive takes priorty here.
            if(a.archive) {
                return 1;
            } else {
                return -1; //the other one is the archive. no need to check b.
            }
        });
        for(var i = 0; i < chapters.length; i++) {
            var litm = document.createElement('div');
            litm.setAttribute('class','chapteritem');
            litm.setAttribute('tabindex',-1);
            litm.innerHTML = 'Ch. ' + chapters[i].number;
            litm.innerHTML += '<div class="listbadgecont"></div>';
            var badges = litm.getElementsByClassName('listbadgecont')[0];
            if(chapters[i].archive) {
                if(Number(harddisk.getItem('labelArchive'))) {
                    badges.innerHTML += badgePrewritten.cbzFile;
                }
            } else {
                if(Number(harddisk.getItem('labelFolder'))) {
                    badges.innerHTML += badgePrewritten.folder;
                }
            }
            if(bookmarks.read.indexOf(chapters[i].number) === -1) {
                badges.innerHTML += badgePrewritten.unread;
            }
            eid('bookchapters').appendChild(litm);
            chapters[i].element = litm;
        }
        bookinfo.chapters.innerHTML = chapters.length + ' chapters available';
        chapteritems = ecn('chapteritem');

        //bookmarks
        var lb = numinchapter(bookmarks.last,3);
        if(lb > -1) {
            chapteritemscur = lb;
            chapteritems[chapteritemscur].setAttribute('class','chapteritem lastread');
            chapteritems[chapteritemscur]
                .getElementsByClassName('listbadgecont')[0].innerHTML += badgePrewritten.last;
        } else {chapteritemscur = 0;}
    }

    //title
    if(!bookinfo.title.textContent) {
        bookinfo.title.textContent = header.textContent = target;
    }

    //garbage data cleaning
    //remove read chapters that don't exist
    for(var i = 0; i < bookmarks.read.length;) {
        var ex = numinchapter(bookmarks.read[i],3);
        if(ex === -1) {
            bookmarks.read.splice(i,1);
        } else {
            i++;
        }
    }

    //final

    screentoggle(true);
    navbarUpdate();
    inited = true;

}

function pushtocharray(number,path,archive) {

    if (
        isFinite(Number(number)) &&
        !isNaN(Number(number))
    ) {
        number = Number(number);
    } else {
        number = path;
    }

    chaptersTemp[arbool(archive)].push({
        number: number,
        path: path,
        archive: archive
    });
}

function numinchapter(num,array) {
    var chk;
    switch(array) {
        case 1: chk = 'folder'; break;
        case 2: chk = 'archive'; break;
        case 3: return chapters.map((entry) => {return entry.number}).indexOf(num);

    }
    return chaptersTemp[chk].map((entry) => {return entry.number}).indexOf(num);
}

function arbool(archive) {
    if(archive) {
        return 'archive';
    } else {
        return 'folder'
    }
}