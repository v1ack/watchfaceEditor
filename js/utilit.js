function showUntanslated() {
    var json = {};
    var strings = document.querySelectorAll('[data-translate-id]');
    for (var i = 0; i < strings.length; i++) {
        //json[strings[i].dataset.translateId] = strings[i].innerHTML;
        if (!(strings[i].dataset.translateId in data.app.lang))
            json[strings[i].dataset.translateId] = strings[i].innerHTML;
        //        console.log(strings[i].dataset.translateId, strings[i]);
        //        if (strings[i].dataset.translateId in data.app.lang)
        //            strings[i].innerHTML = data.app.lang[strings[i].dataset.translateId];
    }
    return JSON.stringify(json);
}
//setTimeout(function () {
//    wfe.load.allinone();
//}, 300);
