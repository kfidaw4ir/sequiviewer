var cur = 0, hiddenprog = 0, settings = ecn('settings');
settings[cur].focus();

window.addEventListener('keydown',function(k) {
    switch(k.key) {
        case "ArrowDown":
            k.preventDefault();
            navMove(true);
            break;
        case "ArrowUp":
            k.preventDefault();
            navMove(false);
            break;
        case "Backspace":
            k.preventDefault();
            window.location = 'index-before.html';
            break;
        case "Enter":
            settingsOK();
            break;

/*             case "7":
                if(hiddenprog === 0) {hiddenprog++;}
                break;
            case "1":
                if(hiddenprog === 1) {hiddenprog++;}
                break;
            case "8":
                if(hiddenprog === 2) {
                    if(harddisk.getItem('hidden') === 'true') {
                        harddisk.setItem('hidden','false');
                        window.alert('Hide hidden by default.');
                    } else {
                        harddisk.setItem('hidden','true');
                        window.alert('Show hidden by default.');
                    }
                }
                break;
 */    }
})

function navMove(down) {
    var next = -1;
    if(down) {next = 1;}
    if(cur + next > settings.length - 1) {
        cur = 0;
        eid('main').scrollTop = 0;
    } else if(cur + next < 0) {
        cur = settings.length - 1;
        eid('main').scrollTop = eid('main').scrollHeight;
    } else {
        cur += next;
    }
    settings[cur].focus();
}

var settingsChangeExc = {
    'pageTurnDirRight': {
        labels: ['Right','Left'],
        value: ()=>{return snbool2onoff(harddisk.getItem('pageTurnDirRight'),'Right','Left')}
    },
    'osdShowMode': {
        labels: ['Toggle','Timeout'],
        value: ()=>{return snbool2onoff(harddisk.getItem('osdShowMode'),'Toggle','Timeout')}
    },
    'osdShowModeToggleDefault': {
        labels: ['Hidden','Showing'],
        value: ()=>{return snbool2onoff(harddisk.getItem('osdShowModeToggleDefault'),'Hidden','Showing')}
    },
    'snapTo': {
        value: direction2string
    }
}
window.addEventListener('load',function(){
    var stels = ecn('settings');
    for(var i = 0; i < stels.length; i++) {
        var stelSetting = stels[i].dataset.setting, 
        stelAction = stels[i].dataset.action,
        stVal;
        if(
            stelSetting && stelAction === undefined
        ) {
            if(stelSetting in settingsChangeExc) {
                stVal = settingsChangeExc[stelSetting].value();
            } else {
                stVal = snbool2onoff(harddisk.getItem(stelSetting));
            }

            getCurrentSettingLabel(stels[i]).textContent = stVal;
        }
    }

    /* ecn('settings-value')[0].textContent = snbool2onoff(harddisk.getItem('snapOn')); //page snap on p turn
    ecn('settings-value')[1].textContent = direction2string(); //snap direction
    ecn('settings-value')[2].textContent = ; //page turn dir    ecn('settings-value')[0].textContent = snbool2onoff(harddisk.getItem('snapOn')); //page snap on p turn
    ecn('settings-value')[3].textContent = snbool2onoff(harddisk.getItem('volKeyPageTurn')); //page snap on p turn
    ecn('settings-value')[4].textContent = snbool2onoff(harddisk.getItem('labelArchive')); 
    ecn('settings-value')[5].textContent = snbool2onoff(harddisk.getItem('labelFolder')); 
    ecn('settings-value')[6].textContent = snbool2onoff(harddisk.getItem('showClock'));  */

})

function settingsOK() {
    var cv = document.activeElement.dataset.setting;
    switch(cv) {
        default: togglesetting(cv); break;
        case 'viewTutorial': window.location = 'tutorial.html'; break;
        case 'viewAboutPage': window.open('about.html'); break;

        case 'pageTurnDirRight':
        case 'osdShowMode':
        case 'osdShowModeToggleDefault':
            var dispLbl = settingsChangeExc[cv].labels;
            togglesetting(cv, dispLbl[0], dispLbl[1]); break;

        case 'snapTo':
            if(harddisk.getItem('defaultSnapX') === '0') { //if x is false
            //    console.log('dsx = 0');
                harddisk.setItem('defaultSnapX','1');
            } else {
                // console.log('dsx = 1');
                harddisk.setItem('defaultSnapX','0');
    
                if(harddisk.getItem('defaultSnapY') === '0') { //if y is false
                    //console.log('dsy = 1');
                    harddisk.setItem('defaultSnapY','1');
                } else {
                    //console.log('dsy = 0');
                    harddisk.setItem('defaultSnapY','0');
                }    
            }
        
            //console.log(harddisk.getItem('defaultSnapX') + harddisk.getItem('defaultSnapY'));
        
            getCurrentSettingLabel().textContent = direction2string();
        
            break;
    }
}

/* function settingsOK() {
    var csdisp = ; //current setting display
    switch(cur) {
    case 0: //view tutorial
        window.location = 'tutorial.html';
        break;
    case 1: //change snap activation
        togglesetting('snapOn');
        break;
    case 2:

    case 3: //change page direction
        togglesetting('pageTurnDirRight','Right','Left'); break;
    case 4: //volume keys for page turning
        togglesetting('volKeyPageTurn'); break;
    case 5: //label archives...
        togglesetting('labelArchive'); break;
    case 6: //..fdsfsdf
        togglesetting('labelFolder'); break;
    case 6: //clock
        togglesetting('showClock'); break;

}
} */

function togglesetting(sname,tr,fa) {
    if(harddisk.getItem(sname) === '1') {
        harddisk.setItem(sname,'0');
    } else {
        harddisk.setItem(sname,'1');
    }
    getCurrentSettingLabel().textContent = snbool2onoff(harddisk.getItem(sname),tr,fa);
}

function snbool2onoff(input,tr,fa) { //string number boolean to on off
    if(input === '1') {
        return tr || 'On';
    } else {
        return fa || 'Off';
    }
}

function direction2string() {
    if(harddisk.getItem('defaultSnapX') === '1') {
        var l = 'Right';
    } else {
        var l = 'Left';
    }

    if(harddisk.getItem('defaultSnapY') === '1') {
        var t = 'Bottom';
    } else {
        var t = 'Top';
    }

    return t + ' ' + l;
}

function getCurrentSettingLabel(ell) {
    if(!ell) {ell = document.activeElement}
    return ell.getElementsByClassName('settings-value')[0];
}