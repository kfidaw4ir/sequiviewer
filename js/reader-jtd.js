var jumpToObjs = {
    dialog: eid('jumpto-dialog'),
    input: eid('jumpto-dialog-input')
};

function jumpToK(k) {
    switch(k.key) {
        case 'Backspace':
            if(jumpToObjs.input.value.length === 0) {
                jumpToShow();
                k.preventDefault();
            }
            break;
        case 'Enter':
            var n = parseInt(jumpToObjs.input.value);
            if(!pageSwitch(n - 1)) {
                jumpToObjs.input.select();
            } else {
                jumpToShow();
            }
            break;
        case 'SoftLeft': jumpToShow(); break;
    }
}

function jumpToShow(show) {
    directionalsHeld = [];
    jumpToObjs.input.value = current + 1;
    if(show) {
        jumpToObjs.dialog.classList.remove('hidden');
        jumpToObjs.input.focus();
        jumpToObjs.input.select();
        currentPage = 1;
    } else {
        jumpToObjs.dialog.classList.add('hidden');
        jumpToObjs.input.blur();
        currentPage = 0;
    }
}