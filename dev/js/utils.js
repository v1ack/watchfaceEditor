function $(el) {
    if (el === null) throw {
        name: "Get element error",
        element: el
    };
    let node = document.getElementById(el);
    if (node === null) throw {
        name: "Get element error",
        element: el
    };
    return node;
}

function $c(el) {
    if ($(el) === null)
        throw {
            name: "ImageError",
            imageIndex: el
        };
    return document.getElementById(el).cloneNode(false);
}

function div(a, b) {
    return (a - a % b) / b;
}

function removeByClass(cl) {
    var els = document.getElementsByClassName(cl);
    for (var i = 0; els.length; i++)
        $("watchface").removeChild(els[0]);
}

export {
    $,
    $c,
    div,
    removeByClass
};