var cur = 0, pages = ecn('page');

window.addEventListener('keydown',function(k) {
    switch(k.key) {
        case "ArrowRight":
            pageChange(true);
            break;
        case "ArrowLeft":
            pageChange(false);
            break;
        case "SoftLeft":
            window.location = 'index-before.html';
            break;
        case "Backspace":
            k.preventDefault();
            window.location = 'index-before.html';
            break;
    }
})

function pageChange(forward) {
    var next = -1;
    if(forward) {next = 1;}
    if(cur + next < pages.length && cur + next > -1) {
        pages[cur].style.display = 'none';
        cur += next;
        pages[cur].style.display = null;
    }

    if(cur === pages.length - 1) {
        navbar.left.innerHTML = 'exit';
    }
}