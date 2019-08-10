function $(el) {
    if (el === null || el === '') throw {
        name: "Get element error: no element",
        element: el
    };
    switch (el[0]) {
        case '<':
            {
                return document.getElementsByTagName(el.slice(1));
            }
        case '.':
            {
                return document.getElementsByClassName(el.slice(1));
            }
        default:
            {
                let node = document.getElementById(el);
                if (node === null) throw {
                    name: "Get element error",
                    element: el
                };
                return node;
            }
    }
}

let $c = el => $(el).cloneNode(false),
    div = (a, b) => (a - a % b) / b;

function removeByClass(cl) {
    for (let i = 0, els = $('.' + cl); els.length; i++)
        $("watchface").removeChild(els[0]);
}

export {
    $,
    $c,
    div,
    removeByClass
};