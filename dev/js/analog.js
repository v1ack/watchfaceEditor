/* global UIkit, pageXOffset, pageYOffset */
import {
    $ as $,
    $c as $c
} from './utils.js';
import wfe from './wfe_obj.js';

function init() {
    //    if (!('analogtabversion' in localStorage) || localStorage.analogtabversion < wfe.app.analogtabversion)
    //        localStorage.analogtabversion = wfe.app.analogtabversion;
    if ('bg' in wfe.coords) {
        let bg = $c(wfe.coords.bg.Image.ImageIndex);
        bg.style.left = wfe.coords.bg.Image.X * 3 + "px";
        bg.style.top = wfe.coords.bg.Image.Y * 3 + "px";
        bg.style.position = "absolute";
        bg.style.zIndex = -1;
        bg.height *= 3;
        bg.width *= 3;
        bg.removeAttribute("id");
        bg.ondragstart = function() {
            return false;
        };
        $("analog-bg").appendChild(bg);
    }
    $('analog-color').onchange = function() {
        currentElement.Color = $('analog-color').value;
        update();
    };
    $('analog-center-x').onchange = function() {
        currentElement.Center.X = Number($('analog-center-x').value);
        update();
    };
    $('analog-center-y').onchange = function() {
        currentElement.Center.Y = Number($('analog-center-y').value);
        update();
    };
    $('analog-fill').onchange = function() {
        if ($('analog-fill').checked)
            currentElement.OnlyBorder = false;
        else
            currentElement.OnlyBorder = true;
        update();
    };
    update(currentElementName ? currentElementName : 'hours');
}

function update(arrow) {
    if (arrow) {
        switch (arrow) {
        case 'hours':
            currentElement = wfe.coords.analoghours;
            break;
        case 'minutes':
            currentElement = wfe.coords.analogminutes;
            break;
        case 'seconds':
            currentElement = wfe.coords.analogseconds;
            break;
        default:
            throw new Error('Update analog error');
        }
        currentElementName = arrow;
    }
    dotCount = 0;
    wfe.makeWf();
    $("analog").innerHTML = '';
    if (('analog' + currentElementName) in wfe.coords) {
        $("analog").innerHTML += '<div class="analog-center" style="left: ' + (currentElement.Center.X * 3 - 11) + 'px;top:' + (currentElement.Center.Y * 3 - 11) + 'px"></div>';
        $("analog").innerHTML += '<div class="analog-line" style="left: ' + (currentElement.Center.X * 3 - 3) + 'px;height:' + (currentElement.Center.Y * 3 - 11) + 'px"></div>';
        $("analog").innerHTML += '<svg id="analogsvg" width="' + wfe.device.width * 3 + '" height="' + wfe.device.height * 3 + '"></svg>';
        for (let i in $("analog").childNodes.length) {
            $("analog").childNodes[i].oncontextmenu = event.preventDefault();
        }
        drawAnalog(currentElement, 0);
        $('analog').onclick = function(e) {
            addDot(e);
        };
        $('analog-center-x').value = currentElement.Center.X;
        $('analog-center-y').value = currentElement.Center.Y;
        $('analog-fill').checked = !currentElement.OnlyBorder;
        $('analog-color').style.backgroundColor = currentElement.Color;
        $('analog-color').value = '';
    } else $('analog').onclick = function() {
        return false;
    };
}

function addDot(e) {
    if (dotCount >= 12)
        return;
    let ed = getOffsetRect($("analog")),
        d = document.createElement('div');
    d.classList.add('analog-dot');
    d.id = 'dot' + dotCount++;
    d.style.left = e.pageX - ed.left - (e.pageX - ed.left) % 3 + 'px';
    d.style.top = e.pageY - ed.top - (e.pageY - ed.top) % 3 + 'px';
    d.oncontextmenu = function(e) {
        e.preventDefault();
        removeDot(e);
    };
    let c = {
        X: (Number(d.style.top.replace('px', '')) + 3 - currentElement.Center.X * 3) / -3,
        Y: (Number(d.style.left.replace('px', '')) + 3 - currentElement.Center.X * 3) / 3
    };
    currentElement.Shape.push(c);
    update(currentElementName);
}

function removeDot(e) {
    if (dotCount > 2) {
        currentElement.Shape.splice(Number(e.target.id.replace('dot', '')), 1);
        dotCount -= 1;
        update(currentElementName);
    }
}

function drawAnalog(el, value) {
    let col = el.Color.replace("0x", "#"),
        d = "M " + el.Shape[0].X * 3 + " " + el.Shape[0].Y * 3,
        iters = el.Shape.length,
        fill = el.OnlyBorder ? "none" : col,
        contextmenu = e => {
            e.preventDefault();
            removeDot(e);
        };
    for (let i = 0; i < iters; i++) {
        d += "L " + el.Shape[i].X * 3 + " " + el.Shape[i].Y * 3 + " ";
        let dot = document.createElement('div');
        dot.classList.add('analog-dot');
        dot.id = 'dot' + dotCount++;
        dot.style.left = el.Shape[i].Y * 3 + el.Center.X * 3 - 4 + 'px';
        dot.style.top = el.Shape[i].X * 3 * (-1) + el.Center.Y * 3 - 4 + 'px';
        dot.oncontextmenu = contextmenu;
        moveDot(dot, currentElement.Shape[i]);
        $('analog').appendChild(dot);
    }
    d += "L " + el.Shape[0].X * 3 + " " + el.Shape[0].Y * 3 + " ";
    $('analogsvg').innerHTML += '<path d="' + d + '" transform="rotate(' + (value - 90) + ' ' + el.Center.X * 3 + ' ' + el.Center.Y * 3 + ') translate(' + el.Center.X * 3 + " " + el.Center.Y * 3 + ') " fill="' + fill + '" stroke="' + col + '"></path>';
}
let currentElement = {},
    currentElementName = 'hours',
    dotCount = 0;

function toggle(elem) {
    switch (elem) {
    case 'hours':
        if ('analoghours' in wfe.coords) {
            delete wfe.coords.analoghours;
            if (!('analoghours' in wfe.coords || 'analogseconds' in wfe.coords || 'analogminutes' in wfe.coords))
                wfe.coords.analog = false;
        } else {
            wfe.coords.analog = true;
            wfe.coords.analoghours = {
                Center: {
                    X: wfe.device.width / 2,
                    Y: wfe.device.height / 2
                },
                Color: "0xFFFFFF",
                OnlyBorder: false,
                Shape: [{
                    X: -17,
                    Y: -2
                }, {
                    X: 54,
                    Y: -2
                }, {
                    X: 54,
                    Y: 1
                }, {
                    X: -17,
                    Y: 1
                }]
            };
        }
        break;
    case 'minutes':
        if ('analogminutes' in wfe.coords) {
            delete wfe.coords.analogminutes;
            if (!('analoghours' in wfe.coords || 'analogseconds' in wfe.coords || 'analogminutes' in wfe.coords))
                wfe.coords.analog = false;
        } else {
            wfe.coords.analog = true;
            wfe.coords.analogminutes = {
                Center: {
                    X: wfe.device.width / 2,
                    Y: wfe.device.height / 2
                },
                Color: "0xFFFFFF",
                OnlyBorder: false,
                Shape: [{
                    X: -17,
                    Y: -2
                },
                {
                    X: 68,
                    Y: -2
                },
                {
                    X: 68,
                    Y: 1
                },
                {
                    X: -17,
                    Y: 1
                }
                ]
            };
        }
        break;
    case 'seconds':
        if ('analogseconds' in wfe.coords) {
            delete wfe.coords.analogseconds;
            if (!('analoghours' in wfe.coords || 'analogseconds' in wfe.coords || 'analogminutes' in wfe.coords))
                wfe.coords.analog = false;
        } else {
            wfe.coords.analog = true;
            wfe.coords.analogseconds = {
                Center: {
                    X: wfe.device.width / 2,
                    Y: wfe.device.height / 2
                },
                Color: "0xFF0000",
                OnlyBorder: false,
                Shape: [{
                    X: -21,
                    Y: -1
                },
                {
                    X: 82,
                    Y: -1
                },
                {
                    X: 82,
                    Y: 0
                },
                {
                    X: -21,
                    Y: 0
                }
                ]
            };
        }
        break;
    default:
        throw new Error('Toggle not found');
    }
    init(elem);
}

function moveDot(el, elcoords) {
    el.onmousedown = function(e) {
        if (e.which !== 1) return;
        let ed = getOffsetRect($("analog")),
            curcoords = getCoords(el),
            shiftX = e.pageX - curcoords.left,
            shiftY = e.pageY - curcoords.top;

        el.style.position = 'absolute';
        moveAt(e);

        el.style.zIndex = 1000;

        function moveAt(e) {
            el.style.left = e.pageX - ed.left - shiftX + 'px';
            el.style.top = e.pageY - ed.top - shiftY + 'px';
        }

        $("analog").onmousemove = function(e) {
            moveAt(e);
        };

        el.onmouseup = function() {
            $("analog").onmousemove = null;
            el.onmouseup = null;
            el.style.zIndex = 'auto';
            let top = styleToNum(el.style.top),
                left = styleToNum(el.style.left);
            el.style.top = top > 0 && top < wfe.device.height * 3 ? Math.round(top / 3) * 3 + 'px' : "0px";
            el.style.left = left > 0 && left < wfe.device.width * 3 ? Math.round(left / 3) * 3 + 'px' : "0px";

            elcoords.X = (Number(el.style.top.replace('px', '')) + 3 - currentElement.Center.X * 3) / -3;
            elcoords.Y = (Number(el.style.left.replace('px', '')) + 3 - currentElement.Center.X * 3) / 3;
            update(currentElementName);
        };

    };

    el.ondragstart = function() {
        return false;
    };

    function getCoords(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

}

// TODO: Убрать дублирующийся из editor.js код
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
function styleToNum (el) {
    return Number(el.replace('px', ''));
}

$('analog-watch-tab').addEventListener('click', () => {
    init('hours');
    UIkit.tab($('analog-tab')).show(0);
});
$('analog-toggle').addEventListener('click', () => toggle(currentElementName));
$('analog-hours').addEventListener('click', () => update('hours'));
$('analog-minutes').addEventListener('click', () => update('minutes'));
$('analog-seconds').addEventListener('click', () => update('seconds'));