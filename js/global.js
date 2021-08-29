var 
navbar = {
    "center": eid('navbar-center'),
    "right":  eid('navbar-right'),
    "left": eid('navbar-left'),
    "self": eid('navbar')
}, 
header = eid('header'),
pathprefix = '.sequiviewer',
harddisk = localStorage;

function eid(id) {return document.getElementById(id)}
function ecn(cn) {return document.getElementsByClassName(cn)}

var devstors = navigator.getDeviceStorages('sdcard');
devstors.forEach(element => {
    if(
        element.storageName.toLowerCase() === 'sdcard' &&
        element.default
    ) {
        pathprefix = 'others/' + pathprefix;
        console.log('detected internal storage');
    } else {
        console.log('detected sdcard');
    }
});
devstors = undefined; //cleanup


//utils below
function updateNavbarOut(a) {
    var nbo = ['left','center','right'];
    for(var i = 0; i < 3; i++) {
        if(!(i in a)) {
            if(!a[i]) { //convert any falsey values like "false" "null" "undefined" etc to empty string
                a[i] = '';
            }
        }
        navbar[nbo[i]].textContent = a[i];
    }
}

function badgelist(text,bgcolor,color,id,cls) {
    var style = 'background-color: ' + bgcolor + ';';
    if(color) {style += 'color:' + color + ';';}
    if(id) {id = 'id="' + id + '"'} else {id = ''}
    if(!cls) {cls = ''}
    return '<span class="listbadge ' + cls + '" style="' + style + '" ' + id + '>' + text + '</span>';
}

function isolateFileName(path) {
    var start = path.lastIndexOf('/'), 
    end = path.lastIndexOf('.');
    if(end === -1) {
        return path.substr(start + 1);
    } else {
        return path.substring(start + 1, end);
    }
}

function timedateformat(input) { //expecting unix time seconds only; no milis. returns a string with year, month, day, hour, minute, and second
    var dateinit = input? (new Date(input * 1000)) : (new Date());
    var times = [
        dateinit.getHours(),
        dateinit.getMinutes(),
        dateinit.getSeconds()
    ];
    for(i=0;i<times.length;i++) {
        if(times[i] < 10) {times[i] = '0' + times[i];}
    }
    return times[0] + ':' + times[1] + ':' + times[2];
}

var toastmsgto = 0;
function toastmsg(msg,args) {
    if(!eid('toastmsg')) {
        var msgel = document.createElement('div');
        msgel.id = 'toastmsg';
        document.body.appendChild(msgel);
    }

    var fg = null, bg = null, to = 5000;
    if(args) {
        if('bg' in args)   {bg = args.bg}
        if('fg' in args)   {fg = args.fg}
        if('time' in args) {to = args.time}
    }

    eid('toastmsg').innerHTML = msg;
    eid('toastmsg').style.transform = null;
    eid('toastmsg').style.opacity = null;

    eid('toastmsg').style.color = fg;
    eid('toastmsg').style.backgroundColor = bg;

    clearTimeout(toastmsgto);
    toastmsgto = setTimeout(function(){
        eid('toastmsg').style.transform = 'translatey(-100%)';
        eid('toastmsg').style.opacity = 0;
    },to);
}