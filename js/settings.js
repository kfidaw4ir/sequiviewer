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
    }
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
});

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
                harddisk.setItem('defaultSnapX','1');
            } else {
                harddisk.setItem('defaultSnapX','0');
    
                if(harddisk.getItem('defaultSnapY') === '0') { //if y is false
                    harddisk.setItem('defaultSnapY','1');
                } else {
                    harddisk.setItem('defaultSnapY','0');
                }    
            }
        
            getCurrentSettingLabel().textContent = direction2string();
        
            break;
    }
}

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