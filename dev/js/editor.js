/* global pageXOffset, pageYOffset */
import wfe from './wfe_obj.js';
import {$, $c, styleToNum, getOffsetRect} from './utils.js';
import updateWatchface from "./watchface_react";
/**
 * Element coordinates. Number blocks may be wrapped into {Number: {...}}
 *
 * @param {string} el name
 * @returns {object} coordinates object
 */
function elCoords(el) {
    let coords = wfe.elements[el].coords();
    if (coords && coords.Number && !('TopLeftX' in coords) && !('X' in coords))
        return coords.Number;
    return coords;
}

/**
 * Image size, works if image is not loaded
 *
 * @param {number|string} index image index
 * @returns {object} width and height
 */
function imgSize(index) {
    let img = document.getElementById(index);
    return img ? {width: img.width, height: img.height} : {width: 10, height: 10};
}

// Max digits count of number blocks
let blockDigits = {
    dateDay: 2,
    dateMonth: 2,
    dateOneLine: 5,
    actSteps: 5,
    actStepsGoal: 5,
    actCalories: 4,
    actPulse: 3,
    actDistance: 4,
    batteryText: 3,
    weatherAirText: 3,
    weatherOneLine: 5,
    weatherDay: 3,
    weatherNight: 3,
    weatherDayAlt: 3,
    weatherNightAlt: 3,
    weatherCurrent: 3
};

/**
 * BottomRight coordinate is set (not 0 and not less than TopLeft)
 *
 * @param {number} bottomRight BottomRightX or BottomRightY
 * @param {number} topLeft TopLeftX or TopLeftY
 * @returns {boolean} is set
 */
const isSet = (bottomRight, topLeft) => bottomRight !== 0 && bottomRight >= topLeft;

/**
 * Block size calculated from digit images
 *
 * @param {object} c block coordinates
 * @param {number} digits digits count
 * @returns {object} width and height
 */
function autoSize(c, digits) {
    let widths = [],
        heights = [];
    for (let i = 0; i < (c.ImagesCount || 10); i++) {
        let size = imgSize(c.ImageIndex + i);
        widths.push(size.width);
        heights.push(size.height);
    }
    // Median, so a single wrong image in the set doesn't blow up the block
    let median = list => list.sort((x, y) => x - y)[Math.floor(list.length / 2)] || 10,
        width = median(widths),
        height = median(heights);
    return {
        width: Math.max(1, width * digits + Math.max(0, c.Spacing || 0) * (digits - 1)),
        height: Math.max(1, height)
    };
}

/**
 * Makes block and inserts it (TopLeft and BottomRight) for visual editor
 *
 * @param {string} el name
 * @returns {null} null
 */
function makeBlock(el) {
    let c = elCoords(el),
        auto = autoSize(c, blockDigits[el] || 2),
        width = Math.min(auto.width, wfe.device.width),
        height = Math.min(auto.height, wfe.device.height),
        left = c.TopLeftX;
    // Block shows digits size and is placed according to alignment.
    // BottomRight may be 0 (not set) in watchface json
    if (isSet(c.BottomRightX, c.TopLeftX)) {
        let area = c.BottomRightX - c.TopLeftX + 1;
        switch (c.Alignment) {
        case 20:
        case 'TopRight':
        case 'Right':
        case 'CenterRight':
        case 'BottomRight':
            left = c.BottomRightX - width + 1;
            break;
        case 24:
        case 'TopCenter':
        case 'Top':
        case 'Center':
        case 'BottomCenter':
        case 'Bottom':
            left = c.TopLeftX + Math.floor((area - width) / 2);
            break;
        default:
        }
    }
    $("editor").innerHTML +=
        '<div id="' + wfe.elements[el].editorId + '" data-offset-x="' + (left - c.TopLeftX) + '" style="height:' + (height * wfe.device.editor_zoom) + 'px; width:' + (width * wfe.device.editor_zoom) + 'px; top:' + (clampCoord(c.TopLeftY, height, wfe.device.height) * wfe.device.editor_zoom) + 'px; left:' + (clampCoord(left, width, wfe.device.width) * wfe.device.editor_zoom) + 'px;" class="editor-elem" uk-tooltip="title: ' + wfe.elements[el].name + '; delay: 750; offset: 1"></div>';
}

/**
 * Keeps element inside editor area
 *
 * @param {number} value coordinate
 * @param {number} size element size
 * @param {number} max area size
 * @returns {number} coordinate
 */
function clampCoord(value, size, max) {
    return Math.min(Math.max(0, value), Math.max(0, max - size));
}

/**
 * Makes block and insetrs it (X and Y) for visual editor
 *
 * @param {string} el name
 * @returns {null} null
 */
function makeImg(el) {
    let c = elCoords(el),
        size = imgSize(c.ImageIndex);
    $("editor").innerHTML +=
        '<div id="' + wfe.elements[el].editorId + '" style="height:' + (size.height * wfe.device.editor_zoom) + 'px; width:' + (size.width * wfe.device.editor_zoom) + 'px; top:' + (c.Y * wfe.device.editor_zoom) + 'px; left:' + (c.X * wfe.device.editor_zoom) + 'px;" class="editor-elem" uk-tooltip="title: ' + wfe.elements[el].name + '; delay: 750; offset: 1"></div>';
}

/**
 * Makes block and inserts it (only for status) for visual editor
 *
 * @param {string} el element
 * @param {string} id in editor html
 * @returns {null} null
 */
function makeImgStat(el, id) {
    $("editor").innerHTML +=
        '<div id="' + id + '" style="height:' + (imgSize('ImageIndexOn' in el ? el.ImageIndexOn : el.ImageIndexOff).height * wfe.device.editor_zoom) + 'px; width:' + (imgSize('ImageIndexOn' in el ? el.ImageIndexOn : el.ImageIndexOff).width * wfe.device.editor_zoom) + 'px; top:' + (el.Coordinates.Y * wfe.device.editor_zoom) + 'px; left:' + (el.Coordinates.X * wfe.device.editor_zoom) + 'px;" class="editor-elem"></div>';
}

/**
 * Makes block and inserts it (TopLeft and BottomRight) for visual editor
 *
 * @param {string} el name
 * @returns {null} null
 */
function makeCircleBlock(el) {
    let circle = wfe.elements[el].coords();
    $("editor").innerHTML +=
        '<div id="' + wfe.elements[el].editorId + '" style="height:' + (circle.RadiusY * 2 * wfe.device.editor_zoom) + 'px; width:' + (circle.RadiusX * 2 * wfe.device.editor_zoom) + 'px; top:' + (circle.CenterY - circle.RadiusY) * wfe.device.editor_zoom + 'px; left:' + (circle.CenterX - circle.RadiusX) * wfe.device.editor_zoom + 'px;" class="editor-elem" uk-tooltip="title: ' + wfe.elements[el].name + '; delay: 750; offset: 1"></div>';
}

function makeCircleAndInitDrag(el) {
    makeCircleBlock(el);
    setTimeout(function () {
        initdrag(wfe.elements[el].editorId,
            wfe.elements[el].coords());
    }, 10);
}

/**
 * Initialise this tab
 * @returns {null} null
 */
function init() {
    // if (!('designtabversion' in localStorage) || localStorage.designtabversion < wfe.app.designtabversion)
    //     localStorage.designtabversion = wfe.app.designtabversion;
    $("editor").innerHTML = '';
    if ('bg' in wfe.coords) {
        let bg = $c(wfe.coords.bg.Image.ImageIndex);
        bg.style.left = wfe.coords.bg.Image.X * wfe.device.editor_zoom + "px";
        bg.style.top = wfe.coords.bg.Image.Y * wfe.device.editor_zoom + "px";
        bg.style.position = "absolute";
        bg.height *= wfe.device.editor_zoom;
        bg.width *= wfe.device.editor_zoom;
        bg.removeAttribute("id");
        $("editor").appendChild(bg);
        setTimeout(function() {
            $("editor").childNodes[0].ondragstart = function() {
                return false;
            };
        }, 10);
    }
    if ('time' in wfe.coords) {
        makeImgAndInitDrag('timeHoursTens');
        makeImgAndInitDrag('timeHoursOnes');
        makeImgAndInitDrag('timeMinutesTens');
        makeImgAndInitDrag('timeMinutesOnes');
        if ('seconds' in wfe.coords) {
            makeImgAndInitDrag('timeSecondsTens');
            makeImgAndInitDrag('timeSecondsOnes');
        }
        if ('amPm' in wfe.coords) {
            $("editor").innerHTML +=
                '<div id="e_time_am" style="height:' + (imgSize(wfe.coords.amPm.ImageIndexAm).height * wfe.device.editor_zoom) + 'px; width:' + (imgSize(wfe.coords.amPm.ImageIndexAm).width * wfe.device.editor_zoom) + 'px; top:' + (wfe.coords.amPm.Y * wfe.device.editor_zoom) + 'px; left:' + (wfe.coords.amPm.X * wfe.device.editor_zoom) + 'px;" class="editor-elem"></div>';
            initdragN('amPm');
        }
    }
    if ('dateWeekday' in wfe.coords)
        makeImgAndInitDrag('dateWeekday');
    if ('dateDay' in wfe.coords)
        makeBlockAndInitDrag('dateDay');
    if ('dateMonth' in wfe.coords)
        makeBlockAndInitDrag('dateMonth');
    if ('dateOneLine' in wfe.coords)
        makeBlockAndInitDrag('dateOneLine');
    if ('actCalories' in wfe.coords)
        makeBlockAndInitDrag('actCalories');
    if ('actSteps' in wfe.coords)
        makeBlockAndInitDrag('actSteps');
    if ('actStepsGoal' in wfe.coords)
        makeBlockAndInitDrag('actStepsGoal');
    if ('actPulse' in wfe.coords)
        makeBlockAndInitDrag('actPulse');
    if ('actDistance' in wfe.coords)
        makeBlockAndInitDrag('actDistance');
    if ('batteryIcon' in wfe.coords)
        makeImgAndInitDrag('batteryIcon');
    if ('batteryText' in wfe.coords)
        makeBlockAndInitDrag('batteryText');
    if ('batteryScale' in wfe.coords) {
        let e_battery_linar_initdrag = i => initdrag(('e_battery_linar_' + i), wfe.coords.batteryScale.Segments[i]);
        for (let i = 0; i < wfe.coords.batteryScale.Segments.length; i++) {
            $("editor").innerHTML +=
                '<div id="e_battery_linar_' + i + '" style="height:' + (imgSize(wfe.coords.batteryScale.StartImageIndex + i).height * wfe.device.editor_zoom) + 'px; width:' + (imgSize(wfe.coords.batteryScale.StartImageIndex + i).width * wfe.device.editor_zoom) + 'px; top:' + (wfe.coords.batteryScale.Segments[i].Y * wfe.device.editor_zoom) + 'px; left:' + (wfe.coords.batteryScale.Segments[i].X * wfe.device.editor_zoom) + 'px;" class="editor-elem"></div>';
            setTimeout(e_battery_linar_initdrag, 10, i);
        }
    }
    if ('statAlarm' in wfe.coords) {
        makeImgStat(wfe.coords.statAlarm, "e_stat_alarm");
        initdragN('statAlarm');
    }
    if ('statBluetooth' in wfe.coords) {
        makeImgStat(wfe.coords.statBluetooth, "e_stat_bt");
        initdragN('statBluetooth');
    }
    if ('statDnd' in wfe.coords) {
        makeImgStat(wfe.coords.statDnd, "e_stat_dnd");
        initdragN('statDnd');
    }
    if ('statLock' in wfe.coords) {
        makeImgStat(wfe.coords.statLock, "e_stat_lock");
        initdragN('statLock');
    }
    if ('weathericon' in wfe.coords)
        if ('CustomIcon' in wfe.coords.weathericon) {
            $("editor").innerHTML +=
                '<div id="e_weather_icon" style="height:' + (imgSize(wfe.coords.weathericon.CustomIcon.ImageIndex).height * wfe.device.editor_zoom) + 'px; width:' + (imgSize(wfe.coords.weathericon.CustomIcon.ImageIndex).width * wfe.device.editor_zoom) + 'px; top:' + (wfe.coords.weathericon.CustomIcon.Y * wfe.device.editor_zoom) + 'px; left:' + (wfe.coords.weathericon.CustomIcon.X * wfe.device.editor_zoom) + 'px;" class="editor-elem"></div>';
            setTimeout(function() {
                initdrag('e_weather_icon', wfe.coords.weathericon.CustomIcon);
            }, 10);
        } else {
            $("editor").innerHTML +=
                '<div id="e_weather_icon" style="height:' + ($("weather").height * wfe.device.editor_zoom) + 'px; width:' + ($("weather").width * wfe.device.editor_zoom) + 'px; top:' + (wfe.coords.weathericon.Coordinates.Y * wfe.device.editor_zoom) + 'px; left:' + (wfe.coords.weathericon.Coordinates.X * wfe.device.editor_zoom) + 'px;" class="editor-elem"></div>';
            setTimeout(function() {
                initdrag('e_weather_icon', wfe.coords.weathericon.Coordinates);
            }, 10);
        }
    if ('weatherOneLine' in wfe.coords)
        makeBlockAndInitDrag('weatherOneLine');
    if ('weatherDay' in wfe.coords)
        makeBlockAndInitDrag('weatherDay');
    if ('weatherNight' in wfe.coords)
        makeBlockAndInitDrag('weatherNight');
    if ('weatherDayAlt' in wfe.coords)
        makeBlockAndInitDrag('weatherDayAlt');
    if ('weatherNightAlt' in wfe.coords)
        makeBlockAndInitDrag('weatherNightAlt');
    if ('weatherCurrent' in wfe.coords)
        makeBlockAndInitDrag('weatherCurrent');
    if ('weatherAirIcon' in wfe.coords)
        makeImgAndInitDrag('weatherAirIcon');
    if ('weatherAirText' in wfe.coords)
        makeBlockAndInitDrag('weatherAirText');
    if ('stepscircle' in wfe.coords) {
        makeCircleAndInitDrag('stepscircle');
    }
    if ('stepsLinear' in wfe.coords) {
        let e_steps_linar_initdrag = i => initdrag(('e_steps_linar_' + i), wfe.coords.stepsLinear.Segments[i]);
        for (let i = 0; i < wfe.coords.stepsLinear.Segments.length; i++) {
            $("editor").innerHTML +=
                '<div id="e_steps_linar_' + i + '" style="height:' + (imgSize(wfe.coords.stepsLinear.StartImageIndex + i).height * wfe.device.editor_zoom) + 'px; width:' + (imgSize(wfe.coords.stepsLinear.StartImageIndex + i).width * wfe.device.editor_zoom) + 'px; top:' + (wfe.coords.stepsLinear.Segments[i].Y * wfe.device.editor_zoom) + 'px; left:' + (wfe.coords.stepsLinear.Segments[i].X * wfe.device.editor_zoom) + 'px;" class="editor-elem"></div>';
            setTimeout(e_steps_linar_initdrag, 10, i);
        }
    }
    if ('stepsGoal' in wfe.coords)
        makeImgAndInitDrag('stepsGoal');
    if ('Animation' in wfe.coords)
        makeImgAndInitDrag('Animation');
}

/**
 * Init drag&drop for element
 *
 * @param {number} el id
 * @param {object} elcoords coordinates object
 * @returns {null} null
 */
function initdrag(el, elcoords) {
    el = $(el);
    el.elcoords = elcoords;
    el.onmousedown = drag_on_mouse_down;
    el.ondragstart = () => false;
}

function drag_on_mouse_down(e) {
    // Dragged element is fixed here: mouse can be over another element while moving
    let el = e.currentTarget,
        zoom = wfe.device.editor_zoom,
        maxLeft = Math.max(0, wfe.device.width * zoom - styleToNum(el.style.width)),
        maxTop = Math.max(0, wfe.device.height * zoom - styleToNum(el.style.height)),
        ed = getOffsetRect($("editor")),
        curcoords = getCoords(el),
        shiftX = e.pageX - curcoords.left,
        shiftY = e.pageY - curcoords.top;
    e.preventDefault();
    wfe.coordsHistory.push(JSON.stringify(wfe.coords));
    el.style.position = 'absolute';
    el.style.zIndex = 1000;

    function moveAt(e) {
        let left = Math.min(Math.max(0, e.pageX - ed.left - shiftX), maxLeft),
            top = Math.min(Math.max(0, e.pageY - ed.top - shiftY), maxTop);
        el.style.left = Math.round(left / zoom) * zoom + 'px';
        el.style.top = Math.round(top / zoom) * zoom + 'px';
        $("e_coords").innerHTML = "X: " + styleToNum(el.style.left) / zoom + ", Y: " + styleToNum(el.style.top) / zoom;
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', moveAt);
        document.removeEventListener('mouseup', onMouseUp);
        el.style.zIndex = 'auto';
        applyPosition(el);
    }

    moveAt(e);
    document.addEventListener('mousemove', moveAt);
    document.addEventListener('mouseup', onMouseUp);
}

function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

/**
 * Writes element position from editor to coords
 *
 * @param {object} el editor element
 * @returns {null} null
 */
function applyPosition(el) {
    let coords = el.elcoords,
        zoom = wfe.device.editor_zoom,
        left = styleToNum(el.style.left) / zoom,
        top = styleToNum(el.style.top) / zoom;
    if ('X' in coords) {
        coords.X = left;
        coords.Y = top;
    } else if ('CenterX' in coords) {
        coords.CenterX = left + coords.RadiusX;
        coords.CenterY = top + coords.RadiusY;
    } else {
        let t1 = coords.TopLeftX,
            t2 = coords.TopLeftY;
        coords.TopLeftX = left - Number(el.dataset.offsetX || 0);
        coords.TopLeftY = top;
        // Keep unset (0) BottomRight as is
        if (isSet(coords.BottomRightX, t1))
            coords.BottomRightX += coords.TopLeftX - t1;
        if (isSet(coords.BottomRightY, t2))
            coords.BottomRightY += coords.TopLeftY - t2;
    }
    updateWatchface();
    $("e_coords").innerHTML = ('coordinates' in wfe.language ? wfe.language.coordinates : "Coordinates");
}

/**
 * Init drag&drop with data from wfe.elements
 * *I dot't give a fuck why timeout is here
 * 
 * @param {string} el name
 * @returns {null} null
 */
function initdragN(el) {
    setTimeout(function() {
        initdrag(wfe.elements[el].editorId, elCoords(el));
    }, 10);
}

function makeImgAndInitDrag(el) {
    try {
        makeImg(el);
        initdragN(el);
    } catch (error) {
        console.warn('Editor: cannot draw ' + el, error);
    }
}

function makeBlockAndInitDrag(el) {
    try {
        makeBlock(el);
        initdragN(el);
    } catch (error) {
        console.warn('Editor: cannot draw ' + el, error);
    }
}

/**
 * Calculate element's best size
 *
 * @param {string} el element
 * @param {number} digitcount max digits count
 * @returns {null} null
 */
function calc(el, digitcount) {
    let width = 0,
        height = 0;
    for (let i = 0; i < el.ImagesCount; i++) {
        if ($(el.ImageIndex + i).width > width)
            width = $(el.ImageIndex + i).width;
        if ($(el.ImageIndex + i).height > height)
            height = $(el.ImageIndex + i).height;
    }
    width = width * digitcount + el.Spacing * (digitcount - 1);
    if (arguments.length > 2)
        for (let i = 2; i < arguments.length; i++)
            width += $(arguments[i]).width + el.Spacing;
    if (el.Alignment === "TopRight") {
        el.BottomRightY = el.TopLeftY + height - 1;
        el.TopLeftX = el.BottomRightX - width + 1;
    } else {
        el.BottomRightY = el.TopLeftY + height - 1;
        el.BottomRightX = el.TopLeftX + width - 1;
    }
}

/**
 * Apply calc() to elements
 *
 * @returns {null} null
 */
function makejsbetter() {
    if ('dateDay' in wfe.coords)
        calc(wfe.coords.dateDay, 2);
    if ('dateMonth' in wfe.coords)
        calc(wfe.coords.dateMonth, 2);
    if ('dateOneLine' in wfe.coords)
        calc(wfe.coords.dateOneLine.Number, 4, wfe.coords.dateOneLine.DelimiterImageIndex);
    if ('batteryText' in wfe.coords)
        calc(wfe.coords.batteryText, 3);
    {
        if ('actCalories' in wfe.coords)
            calc(wfe.coords.actCalories.Number, 4);
        if ('actSteps' in wfe.coords)
            calc(wfe.coords.actSteps.Number, 5);
        if ('actStepsGoal' in wfe.coords)
            calc(wfe.coords.actStepsGoal.Number, 5);
        if ('actPulse' in wfe.coords)
            calc(wfe.coords.actPulse.Number, 3);
        if ('actDistance' in wfe.coords)
            calc(wfe.coords.actDistance.Number, 4, wfe.coords.actDistance.DecimalPointImageIndex, wfe.coords.actDistance.SuffixImageIndex);
    }
    {
        if ('weatherOneLine' in wfe.coords)
            calc(wfe.coords.weatherOneLine.Number, 4, wfe.coords.weatherOneLine.MinusSignImageIndex, wfe.coords.weatherOneLine.DelimiterImageIndex, wfe.coords.weatherOneLine.DegreesImageIndex);
        if ('weatherDay' in wfe.coords)
            calc(wfe.coords.weatherDay.Number, 2, wfe.coords.weatherDay.MinusImageIndex || wfe.coords.weatherDay.MinusSignImageIndex, wfe.coords.weatherDay.DegreesImageIndex);
        if ('weatherNight' in wfe.coords)
            calc(wfe.coords.weatherNight.Number, 2, wfe.coords.weatherNight.MinusImageIndex || wfe.coords.weatherNight.MinusSignImageIndex, wfe.coords.weatherNight.DegreesImageIndex);
        if ('weatherCurrent' in wfe.coords)
            calc(wfe.coords.weatherCurrent.Number, 2, wfe.coords.weatherCurrent.MinusImageIndex || wfe.coords.weatherCurrent.MinusSignImageIndex, wfe.coords.weatherCurrent.DegreesImageIndex);
    }
    init();
    wfe.makeWf();
}

/**
 * Undo action
 *
 * @returns {null} null
 */
function undo() {
    if (wfe.coordsHistory.length) {
        wfe.coords = JSON.parse(wfe.coordsHistory.pop());
        init();
        wfe.makeWf();
    }
}
$('editor-tab').addEventListener('click', init);
$('fix-coords').addEventListener('click', makejsbetter);
$('editor-undo').addEventListener('click', undo);