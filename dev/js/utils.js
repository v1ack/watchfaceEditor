function $(el) {
    if (el === null || el === '') throw new Error("Get element error - no element: " + el);
    switch (el[0]) {
    case '<':
        return document.getElementsByTagName(el.slice(1));
    case '.':
        return document.getElementsByClassName(el.slice(1));
    default:
        if (document.getElementById(el) === null) throw new Error("Get element error: " + el);
        return document.getElementById(el);
    }
}

let $c = el => $(el).cloneNode(false),
    div = (a, b) => (a - a % b) / b;

export {
    $,
    $c,
    div
};