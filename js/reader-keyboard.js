function mainK(k) {
    var movementAct = false;
    switch(k.key) {
        
        case "Backspace":
            k.preventDefault();
            if(document.fullscreenElement) {
                document.exitFullscreen();
                break;
            }
            history.back();
            //window.location = 'chapterlist.html#' + hashproced.target;
            break;
        case "SoftLeft":
            if(!document.fullscreenElement) {
                document.body.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            break;
        case "SoftRight": jumpToShow(true); break;
        case "Enter":
            //hider.style.display = 'none';
            hider.classList.add('hidden')
            break;
        
        case '0':
            osdToggle();
            break;

        default:
            pagedModeK(k);
            break;

    }
    movementUpdate();
    if(movementAct) {
        updatePososd();
        pososdShow();
    }
}

function pagedModeK(k) {
    switch(k.key) {
        case "VolumeUp":
            if(harddisk.getItem('volKeyPageTurn') === '0') {break;}
        case "ArrowRight":
            k.preventDefault();
            pageSwitch(true);
            break;
        case "VolumeDown":
            if(harddisk.getItem('volKeyPageTurn') === '0') {break;}
        case "ArrowLeft":
            k.preventDefault();
            pageSwitch(false);
            break;

        //image transforms below//
        //reset
        case '5': 
            viewimgscale = 100;
            viewimgtranslatex = 50;
            viewimgtranslatey = 50;
            displayScale();
            movementAct = true;
            break;

        //zoom
        case 'ArrowDown':
            k.preventDefault();
            displayScale(false);
            movementAct = true;
            break;
        case 'ArrowUp':
            k.preventDefault();
            displayScale(true);
            movementAct = true;
            break;

        //movex
        case '4':
            directionalsHeld.push('4'); 
            movementHoldLoop();
            break;
        case '6':
            directionalsHeld.push('6'); 
            movementHoldLoop();
            break;
        
        //movey
        case '2':
            directionalsHeld.push('2'); 
            movementHoldLoop();
            break;
        case '8':
            directionalsHeld.push('8'); 
            movementHoldLoop();
            break;

        //shoot the user to the corner of the page.
        case '9': //bottom right
            cornerPos(true,true);
            movementAct = true;
            break;
            
        case '7': //bottom left
            cornerPos(false,true);
            movementAct = true;
            break;

        case '3': //top right
            cornerPos(true,false);
            movementAct = true;
            break;

        case '1': //top left
            cornerPos(false,false);
            movementAct = true;
            break;
    }
}

function mainKup(k) {
    //make a temporary function for removing a dir
    var dhrm = (num) => {
        directionalsHeld.splice(directionalsHeld.indexOf(num),1);
    };
    switch(k.key) {
        //movex
        case '4': dhrm('4'); break;
        case '6': dhrm('6'); break;
        //movey
        case '2': dhrm('2'); break;
        case '8': dhrm('8'); break;
            
    }
}