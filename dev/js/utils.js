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

const $c = el => $(el).cloneNode(false),
    div = (a, b) => (a - a % b) / b;

/**
 * Convert style value to Number
 *
 * @param {string} el style value
 * @returns {Number} style value in number
 */
const styleToNum = el => Number(el.replace('px', ''));

/**
 * It's for drag&drop
 *
 * @param {object} elem DOM element
 * @returns {object} top and left paddings
 */
function getOffsetRect(elem) {
    let box = elem.getBoundingClientRect(),
        body = document.body,
        docElem = document.documentElement,
        scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
        scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        clientTop = docElem.clientTop || body.clientTop || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        top = box.top + scrollTop - clientTop,
        left = box.left + scrollLeft - clientLeft;

    return {
        top: Math.round(top),
        left: Math.round(left)
    };
}

export {
    $,
    $c,
    div,
    styleToNum,
    getOffsetRect
};