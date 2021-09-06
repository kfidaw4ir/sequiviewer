function createNetRequest(url, type, donefn, errfn, autosend) {
    var rq = new XMLHttpRequest(), emptyfn = (()=>{});

    rq.onload = donefn || emptyfn;
    rq.onerror = errfn || emptyfn;
    rq.onabort = errfn || emptyfn;

    rq.open(type, url);
    if(autosend) {rq.send();}
    return rq;
}