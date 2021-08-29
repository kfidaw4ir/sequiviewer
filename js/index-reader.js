var /* filereader = new FileReader,  */
    sdcard = navigator.getDeviceStorage('sdcard'),
    libraryscanner,
    starttime,
    librarylocation = pathprefix + '/',
    librarydata = {},
    mdataWating = [0, 0],
    letters = [],
    libraryscannernum = 0,
    hidden = location.hash.substr(1) === 'hidden';

beginscan();
if (hidden) {
    eid('hiddentitlebadge').classList.remove('hidden');
}

function beginscan() {
    blanklibraryout('Loading!');
    starttime = new Date();

    libraryscanner = sdcard.enumerate(librarylocation);
    libraryscanner.onsuccess = function () {
        if (libraryscanner.result) {

            var fname = libraryscanner.result.name.substr(libraryscanner.result.name.indexOf(librarylocation) + librarylocation.length);
            //var fname = isolateFileName(libraryscanner.result.name);
            if (fname.indexOf('/') === 0) {
                fname = fname.substr(1);
            } //remove extra '/'
            if (fname.indexOf('/') > -1) { //if not a subfolder
                var ldAccessname = fname.substring(0, fname.indexOf('/'));
                if (!(ldAccessname in librarydata)) {
                    librarydata[ldAccessname] = {
                        'name': ldAccessname,
                        'displayname': ldAccessname,
                        'sortname': ldAccessname,
                        'author': 'Unknown Author',
                        'cover': false,
                        'hidden': false
                    };
                } //make the object if not in ld

                var chnum = fname.substr(ldAccessname.length + 1).toLowerCase(); //cut out bookname + 1 for '/'
                if (libraryscanner.result.type.indexOf('image' > -1) && /^cover\./.test(chnum)) {
                    //check if is cover
                    librarydata[ldAccessname].cover = libraryscanner.result;
                } else {
                    switch (chnum) {
                        case 'r18':
                        case 'r18.txt':
                        case 'hidden':
                        case 'hidden.txt':
                            //detected file called 'hidden' or 'hidden', signifies this is adult contnet
                            librarydata[ldAccessname].hidden = true;
                            break;

                        case 'metadata':
                        case 'metadata.json':
                        case 'metadata.txt':
                            var tfr = new FileReader();
                            tfr.readAsText(libraryscanner.result);
                            mdataWating[0]++;
                            tfr.onload = () => {
                                frb: {

                                    var mdataProps;
                                    try {
                                        mdataProps = JSON.parse(tfr.result);
                                    } catch (e) {
                                        console.error(e);
                                        break frb;
                                    }

                                    if ('sortname' in mdataProps) {
                                        librarydata[ldAccessname].sortname = mdataProps.sortname;
                                    }

                                    if ('name' in mdataProps) {
                                        librarydata[ldAccessname].displayname = mdataProps.name;
                                    }

                                    if ('author' in mdataProps) {
                                        librarydata[ldAccessname].author = mdataProps.author;
                                    }
                                }
                                mdataWating[1]++;
                                if (
                                    mdataWating[0] === mdataWating[1] &&
                                    libraryscanner.done
                                ) {
                                    parseld();
                                }
                                //libraryscanner.continue();
                                //continueReading = false;
                            };
                            break;

                    }
                }


                
            }

            blanklibraryout('Loading! ' + ++libraryscannernum + ' files found!');
            //eid('librarycont').innerHTML = 'Loading: ' + Object.keys(librarydata).length + ' works found...';

            libraryscanner.continue();
        } else {
            console.log('all file enumed.');
            //done?
            if (mdataWating[0] === mdataWating[1]) {
                parseld();
            } else {
                blanklibraryout('Loading! Waiting for metadata reading...' + `(${mdataWating[0]}/${mdataWating[1]})`);
            }
        }


    }

    libraryscanner.onerror = function () {
        switch (libraryscanner.error.name) {
            case 'SecurityError':
                blanklibraryout('You need to give access to your storage area!<p>Go to your System Settings, then App Permissions, then enable storage access for sequiviewer.');
                break;
            case 'NotFoundError':
                blanklibraryout('The "' + pathprefix + '" folder was not found!<p>Refer to the tutorial and website for more details.');
                break;
        }
    }
}

function parseld() {
    eid('librarycont').innerHTML = '';
    var libraryels = [];
    for (var bk of Object.keys(librarydata)) {
        var proceed = true;

        if (librarydata[bk].hidden !== hidden) {
            proceed = false;
        }

        if (proceed) {
            var litm = document.createElement('div');
            litm.dataset.name = librarydata[bk].sortname;
            litm.dataset.targetname = bk;
            //litm.setAttribute('data-name',bk);
            litm.setAttribute('class', 'libraryitem');
            litm.setAttribute('tabindex', -1);

            /* var hiddenbd = '';
            if(librarydata[bk].hidden) {
                hiddenbd = '<div class="hiddenbadge">Hidden</div>';
            } */

            var icon, cover;
            if (librarydata[bk].cover) {
                icon = URL.createObjectURL(librarydata[bk].cover);
                cover = icon;
            } else {
                if (librarydata[bk].hidden) {
                    icon = 'img/hidden-icon-placeholder.png';
                    cover = 'img/hidden-cover-placeholder.png';
                } else {
                    icon = 'img/icon-placeholder.png';
                    cover = 'img/cover-placeholder.png';
                }
            }

            /* var descriptiontmp = '<i>No description available.</i>';
            if("description" in thing.metadata) {
                descriptiontmp = thing.metadata.description;
            } */

            //are you ready for a very long string?
            litm.innerHTML = '<img src="' + icon + '" class="icon" /><img src="' + cover + '" class="cover" /><span class="title">' + librarydata[bk].displayname + '</span><div class="description">' + librarydata[bk].author + '</div>' /*  + hiddenbd */ ;
            libraryels.push(litm);
            //eid('librarycont').appendChild(litm);
        }
    }

    libraryels.sort((a, b) => {
        return new Intl.Collator(['en-US', 'ja-JP', 'zh-CN']).compare(a.dataset.name, b.dataset.name);

        /* if(a.dataset.name < b.dataset.name){return -1}
        if(a.dataset.name > b.dataset.name){return 1}
        return 0; */
    });

    //console.log(`length: $(libraryels.length)`);
    for (var i = 0; i < libraryels.length; i++) {
        //console.log(i);
        var ltr = libraryels[i].dataset.name.substr(0, 1).toLowerCase();
        if (letters.map((l) => {
                return l.letter
            }).indexOf(ltr) === -1) {
            letters.push({
                letter: ltr,
                index: i
            });
        }

        eid('librarycont').appendChild(libraryels[i]);
    }

    /*         libraryels.forEach(element => {
                eid('librarycont').appendChild(element);
            });
     */

    //finish up
    libitem = ecn('libraryitem');
    libitemcur = 0;
    if (libitem.length === 0) {
        blanklibraryout('No works found.');
    } else {
        window.addEventListener('focus', function () {
            libitem[libitemcur].focus();
        });
        libitem[libitemcur].focus();

        eid('header-subtitle-info').textContent = `read ${libraryscannernum} files in ${((new Date() - starttime) / 1000).toFixed(2)}s`;
        eid('header-subtitle-default').classList.add('hidden');
        eid('header-subtitle-info').classList.remove('hidden');

        setTimeout(function () {
            eid('header-subtitle-default').classList.remove('hidden');
            eid('header-subtitle-info').classList.add('hidden');
        }, 5000);

/*         if (hidden) {
            toastmsg('Hidden works are currently visible - 718 to hide.', {
                bg: '#f00',
                time: 3000
            });
        }
 */    }

    //cleanup
    starttime = undefined;
    libraryscannernum = undefined;
    libraryscanner = undefined;
    librarydata = undefined;
}

function blanklibraryout(text) {
    eid('librarycont').innerHTML = '<div class="screencenter">' + text + '</div>';
}