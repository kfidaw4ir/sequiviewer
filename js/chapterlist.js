var oninfoscreen = true, chapteritems, chapteritemscur = 0, inited = false, curpage = 0;
window.addEventListener('keydown',keyhandle);
function keyhandle(k) {
    if(inited) {
        switch(k.key) {
            case "SoftLeft":
                screentoggle();
                break;
            case "Enter":
                if(!oninfoscreen) {
                    if(ecn('lastread').length > 0) {
                        ecn('lastread')[0].setAttribute('class','chapteritem'); //reset
                        eid('chapter-lastread').remove();
                    }
                    var chici = chapteritems[chapteritemscur];
                    chici.setAttribute('class','chapteritem lastread'); //set new
                    chici.getElementsByClassName('listbadgecont')[0].innerHTML += badgePrewritten.last;
                    
                    var chci = chapters[chapteritemscur];
                    bookmarks.last = chci.number;
                    if(bookmarks.read.indexOf(chci) === -1) {
                        bookmarks.read.push(chci.number);
                    }

                    harddisk.setItem('bookmarks-' + target, JSON.stringify(bookmarks));
                    updateUnread();

                    var params = {
                        target: target,
                        name: bookinfo.title.textContent,
                        chapter: chci.path,
                        hidden: !eid('hiddenbadge').style.display,
                        type: Number(chci.archive)
                    };

                    console.log(params);

                    window.location = 'reader.html#' + encodeURIComponent(JSON.stringify(params));
                    //window.location = 'reader.html#' + '{"name":"' + libraryjson.metadata.title + '","path":"' + libraryjson.target + '/' + chapters[chapteritemscur] + '","hidden":' + libraryjson.metadata.hidden +',"target":' + target + '}';
                }
                break;
            case "Backspace":
                k.preventDefault();
                history.back();
                break;
                
            case "ArrowUp":
                if(!oninfoscreen) {
                    k.preventDefault();
                    chapternav(true);
                } else {
                    bookinfo.description.focus();
                    document.body.scrollTop = 0;
                }
                break;
            case "ArrowDown":
                if(!oninfoscreen) {
                    k.preventDefault();
                    chapternav(false);
                } else {
                    bookinfo.description.focus();
                    document.body.scrollTop = 0;
                }
                break;
        }

        navbarUpdate();
    }
}

function updateUnread() {
    for(var i = 0; i < chapters.length; i++) {
        var lbc = chapters[i].element.getElementsByClassName('listbadgecont')[0],
        ure = lbc.getElementsByClassName('chapter-unread');
        switch(
            (bookmarks.read.indexOf(chapters[i].number) > -1) + 
            ((0 in ure) << 1)
        ) {
            case 3: //chapter is read, and the badge exists
                ure[0].remove(); break;
            case 0: //chapter is unread, and the badge doe not exist
                lbc.innerHTML += badgePrewritten.unread; break;
        }
    }
}

function chapternav(up) {
    if(up) {
        if(chapteritemscur > 0) {
            chapteritemscur--;
        } else {
            chapteritemscur = chapteritems.length - 1;
        }
    } else {
        if(chapteritemscur < chapteritems.length - 1) {
            chapteritemscur++;
        } else {
            chapteritemscur = 0;
        }
    }
    chapteritems[chapteritemscur].focus();
}

function screentoggle(man) {
    if(man !== undefined) {
        var oninfoscreenloc = man;
        oninfoscreen = !oninfoscreenloc;
    } else {
        var oninfoscreenloc = oninfoscreen;
        oninfoscreen = !oninfoscreen; //flip AFTER we set local value
    }
    if(oninfoscreenloc){
        eid('bookinfo').style.display = 'none';
        eid('bookchapters').style.display = 'block';
        if(chapteritems.length > 0) {chapteritems[chapteritemscur].focus();}
    } else {
        eid('bookinfo').style.display = 'block';
        eid('bookchapters').style.display = 'none';
        //if(chapteritems.length > 0) {chapteritems[chapteritemscur].blur();}
        bookinfo.description.focus();
    }
}

function navbarUpdate() {
    if(oninfoscreen) {
        updateNavbarOut(['chapters']);
    } else {
        updateNavbarOut(['info','read','']); 
    }
/*     switch(curpage) {
        case 0: break;
        case 1:
    }
 */}