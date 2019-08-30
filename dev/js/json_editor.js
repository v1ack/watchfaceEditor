/* global UIkit, saveAs */
import {$} from './utils.js';
import wfe from './wfe_obj.js';
import jsonlint from 'jsonlint-mod';

let elements = ['seconds', 'amPm', 'dateWeekday', 'dateDay', 'dateMonth', 'dateOneLine', 'batteryIcon', 'batteryText', 'batteryScale', 'statAlarm', 'statBluetooth', 'statDnd', 'statLock', 'actCalories', 'actSteps', 'actStepsGoal', 'actPulse', 'actDistance', 'weatherOneLine', 'weatherDay', 'weatherNight', 'weatherCurrent', 'stepsLinear', 'stepsGoal', 'weatherAirIcon', 'weatherAirText', 'weatherDayAlt', 'weatherNightAlt', 'stepscircle'];

function toggleButton(element) {
    if (element in wfe.coords)
        togglebuttonOld('tg-' + element, 1);
    else
        togglebuttonOld('tg-' + element, 0);
}

function togglebuttonOld(bt, state) {
    if (state) {
        $(bt).classList.add("uk-button-primary");
        $(bt).classList.remove("uk-button-default");
    } else {
        $(bt).classList.remove("uk-button-primary");
        $(bt).classList.add("uk-button-default");
    }
}

function updatecode() {
    $("codearea").innerHTML = syntaxHighlight(JSON.stringify(wfe.converter.export(wfe.coords), null, 4));
    if (checkDef())
        $("defaultimages").classList.add("uk-label-success");
    else
        $("defaultimages").classList.remove("uk-label-success");
    wfe.makeWf();
    for (let e in elements)
        toggleButton(elements[e]);
    if (wfe.coords.weather) {
        if (wfe.coords.weathericon)
            if ('CustomIcon' in wfe.coords.weathericon) {
                togglebuttonOld("tg-weatherIconCustom", 1);
                togglebuttonOld("tg-weatherIcon", 0);
            } else {
                togglebuttonOld("tg-weatherIcon", 1);
                togglebuttonOld("tg-weatherIconCustom", 0);
            }
        else {
            togglebuttonOld("tg-weatherIcon", 0);
            togglebuttonOld("tg-weatherIconCustom", 0);
        }
    } else {
        togglebuttonOld("tg-weatherIcon", 0);
        togglebuttonOld("tg-weatherIconCustom", 0);
    }
}
let toggleElements = {
    amPm: '"AmPm":',
    seconds: '"Seconds":',
    dateWeekday: '"WeekDay":',
    dateOneLine: '"MonthAndDay":',
    dateDay: '"MonthAndDay":',
    dateMonth: '"Month":',
    statAlarm: '"Alarm":',
    statBluetooth: '"Bluetooth":',
    statLock: '"Lock":',
    statDnd: '"DoNotDisturb":',
    actSteps: '"Steps":',
    actStepsGoal: '"StepsGoal":',
    actCalories: '"Calories":',
    actDistance: '"Distance":',
    actPulse: '"Pulse":',
    batteryIcon: '"Battery":',
    batteryText: '"Battery":',
    batteryScale: '"Battery":',
    weatherIcon: '"Weather":',
    weatherIconCustom: '"CustomIcon":',
    weatherAirIcon: '"AirPollution":',
    weatherAirText: '"AirPollution":',
    weatherOneLine: '"Temperature":',
    weatherCurrent: '"Current":',
    weatherDay: '"Temperature":',
    weatherNight: '"Night":',
    stepsGoal: '"GoalImage":',
    stepsLinear: '"Linear":',
    weatherDayAlt: '"DayAlt":',
    weatherNightAlt: '"NightAlt":'
};

function toggle_new(elementName) {
    let element = wfe.elements[elementName];
    if (!element) {
        console.warn(elementName);
        return;
    }
    if (wfe.coords[elementName]) {
        Reflect.deleteProperty(wfe.coords, elementName);
    } else {
        if (element.require) 
            if (element.require[0] === 'monthAndDate') {
                if (!('monthandday' in wfe.coords))
                    wfe.coords.monthandday = {
                        TwoDigitsMonth: true,
                        TwoDigitsDay: true
                    };
            }
        wfe.coords[elementName] = element.defaultCoords();
    }
}

function toggle(el) {
    let old_elements = ['weatherNightAlt', 'seconds', 'weatherIcon', 'weatherIconCustom', 'weatherDayAlt'];
    if (old_elements.includes(el)) {
        switch (el) {
        case 'seconds': {
            if ('seconds' in wfe.coords) {
                Reflect.deleteProperty(wfe.coords, 'seconds');
            } else {
                wfe.coords.seconds = {
                    Tens: {
                        X: 0,
                        Y: 0,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    Ones: {
                        X: 10,
                        Y: 0,
                        ImageIndex: 200,
                        ImagesCount: 10
                    }
                };
            }
            break;
        }
        case 'weatherIcon': {
            if (!(wfe.coords.weather))
                wfe.coords.weather = true;
            if (wfe.coords.weathericon) {
                delete wfe.coords.weathericon;
                if (!('weathericon' in wfe.coords || 'weatherAirIcon' in wfe.coords || 'weatherOneLine' in wfe.coords || 'weatherCurrent' in wfe.coords || 'weatherDay' in wfe.coords || 'weatherNight' in wfe.coords || 'weatherAirText' in wfe.coords))
                    wfe.coords.weather = false;
            } else
                wfe.coords.weathericon = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    }
                };
            break;
        }
        case 'weatherIconCustom': {
            if (!(wfe.coords.weather))
                wfe.coords.weather = true;
            if (wfe.coords.weathericon) {
                delete wfe.coords.weathericon;
                if (!('weathericon' in wfe.coords || 'weatherAirIcon' in wfe.coords || 'weatherOneLine' in wfe.coords || 'weatherCurrent' in wfe.coords || 'weatherDay' in wfe.coords || 'weatherNight' in wfe.coords || 'weatherAirText' in wfe.coords))
                    wfe.coords.weather = false;
            } else
                wfe.coords.weathericon = {
                    CustomIcon: {
                        X: 0,
                        Y: 0,
                        ImageIndex: 267,
                        ImagesCount: 26
                    }
                };
            break;
        }
        case 'weatherDayAlt': {
            if ('weatherDayAlt' in wfe.coords)
                delete wfe.coords.weatherDayAlt;
            else if (!(wfe.coords.weather) || !('weatherDay' in wfe.coords)) {
                wfe.coords.weather = true;
                wfe.coords.weatherDay = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 33,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusImageIndex: 217,
                    DegreesImageIndex: 218
                };
                wfe.coords.weatherDayAlt = {
                    Number: {
                        TopLeftX: 10,
                        TopLeftY: 10,
                        BottomRightX: 43,
                        BottomRightY: 19,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusImageIndex: 217,
                    DegreesImageIndex: 218
                };
            } else
                wfe.coords.weatherDayAlt = {
                    Number: {
                        TopLeftX: 10,
                        TopLeftY: 10,
                        BottomRightX: wfe.coords.weatherDay.Number.BottomRightX - wfe.coords.weatherDay.Number.TopLeftX + 10,
                        BottomRightY: wfe.coords.weatherDay.Number.BottomRightY - wfe.coords.weatherDay.Number.TopLeftY + 10,
                        Alignment: "TopLeft",
                        Spacing: wfe.coords.weatherDay.Number.Spacing,
                        ImageIndex: wfe.coords.weatherDay.Number.ImageIndex,
                        ImagesCount: wfe.coords.weatherDay.Number.ImagesCount
                    },
                    MinusImageIndex: wfe.coords.weatherDay.Number.MinusImageIndex,
                    DegreesImageIndex: wfe.coords.weatherDay.Number.DegreesImageIndex
                };
            
            break;
        }
        case 'weatherNightAlt': {
            if ('weatherNightAlt' in wfe.coords)
                delete wfe.coords.weatherNightAlt;
            else if (!(wfe.coords.weather) || !('weatherNight' in wfe.coords)) {
                wfe.coords.weather = true;
                wfe.coords.weatherNight = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 33,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusImageIndex: 217,
                    DegreesImageIndex: 218
                };
                wfe.coords.weatherNightAlt = {
                    Number: {
                        TopLeftX: 10,
                        TopLeftY: 10,
                        BottomRightX: 43,
                        BottomRightY: 19,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusImageIndex: 217,
                    DegreesImageIndex: 218
                };
            } else
                wfe.coords.weatherNightAlt = {
                    Number: {
                        TopLeftX: 10,
                        TopLeftY: 10,
                        BottomRightX: wfe.coords.weatherNight.Number.BottomRightX - wfe.coords.weatherNight.Number.TopLeftX + 10,
                        BottomRightY: wfe.coords.weatherNight.Number.BottomRightY - wfe.coords.weatherNight.Number.TopLeftY + 10,
                        Alignment: "TopLeft",
                        Spacing: wfe.coords.weatherNight.Number.Spacing,
                        ImageIndex: wfe.coords.weatherNight.Number.ImageIndex,
                        ImagesCount: wfe.coords.weatherNight.Number.ImagesCount
                    },
                    MinusImageIndex: wfe.coords.weatherNight.Number.MinusImageIndex,
                    DegreesImageIndex: wfe.coords.weatherNight.Number.DegreesImageIndex
                };
            break;
        }
        default:
            console.error('Error in toggle: ', el);
        }
    } else
        toggle_new(el);
    updatecode();
    select(toggleElements[el]);
}

function select(s) {
    let target = findspan(s);
    if (!target) return 0;
    let range = document.createRange();
    range.selectNode(target.childNodes[0]);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    $("codearea").scrollTop = target.offsetTop - 200;
}

function findspan(s) {
    for (let i = 0; i < $("codearea").childNodes.length; i++)
        if ($("codearea").childNodes[i].tagName === 'SPAN')
            if ($("codearea").childNodes[i].childNodes[0].data === s)
                return $("codearea").childNodes[i];
}

function init() {
    //    if (!('editortabversion' in localStorage) || localStorage.editortabversion < wfe.app.editortabversion)
    //        localStorage.editortabversion = wfe.app.editortabversion;
    updatecode();
    if (wfe.app.firstopen_editor && localStorage.showcount < 8) {
        sessionStorage.firstopen_editor = false;
        UIkit.notification(('jsonupdate' in wfe.language ? wfe.language.jsonupdate : "To update pre.just click out of JSON input"), {
            status: 'primary',
            pos: 'top-left',
            timeout: 3000
        });
        wfe.app.firstopen_editor = false;
    }
}

function syntaxHighlight(json) {
    json = json.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/gu, function (match) {
        let cls = 'number';
        if ((/^"/u).test(match)) {
            if ((/:$/u).test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if ((/true|false/u).test(match)) {
            cls = 'boolean';
        } else if ((/null/u).test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function checkDef(show) {
    let defImagesList = [];
    for (let i = 0; i < $('watchface').childNodes.length; i++)
        if ($('watchface').childNodes[i].classList.contains('default-image'))
            defImagesList.push($('watchface').childNodes[i].src.slice(-7, -4));
    defImagesList.sort();
    for (let i = defImagesList.length - 1; i > 0; i--) {
        if (defImagesList[i] === defImagesList[i - 1]) defImagesList.splice(i, 1);
    }
    if (show && defImagesList.length)
        UIkit.notification(('checkImages' in wfe.language ? wfe.language.checkImages : "Check images in watchface folder. At least images with index(s): ") + defImagesList, {
            status: 'warning',
            pos: 'top-left',
            timeout: 5000
        });
    return defImagesList.length;
}

function checkLimits() {
    function notify(message) {
        UIkit.notification(message, {
            status: 'warning',
            pos: 'top-left',
            timeout: 5000
        });
    }
    if ('stepsLinear' in wfe.coords)
        if (wfe.coords.stepsLinear.Segments.length > 20)
            notify('imagesLimitSteps' in wfe.language ? wfe.language.imagesLimitSteps : "Image limit for steps progress is 20. If you use more, they won't be dispaly");
}

function exportjs() {
    checkDef(1);
    checkLimits();
    if (wfe.app.notWebkitBased) {
        let blob = new Blob([JSON.stringify(wfe.converter.export(wfe.coords), null, 4)], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, wfe.data.wfname + '.json');
    } else {
        let a = document.createElement('a');
        a.href = 'data:application/octet-stream;base64, ' + btoa(JSON.stringify(wfe.converter.export(wfe.coords), null, 4));
        a.download = wfe.data.wfname + '.json';
        a.click();
    }
}

function codeareablur() {
    try {
        wfe.coordsHistory.push(JSON.stringify(wfe.coords));
        wfe.coords = wfe.converter.import(jsonlint.parse($("codearea").innerText));
        updatecode();
    } catch (error) {
        $("jsonerrortext").innerHTML = error;
        setTimeout(function () {
            UIkit.modal($("jsonerrormodal")).show();
        }, 250);
        console.warn(error);
    }
}

function undo() {
    if (wfe.coordsHistory.length) {
        wfe.coords = JSON.parse(wfe.coordsHistory.pop());
        updatecode();
    }
}
// let regexr = /<\/?\w*>|<\w*\s\w*="#[\w\d]{6}">|<([\w\s]*="[\s\w:(,);\-&.]*")*>/g,
//     regexrimg = /"(Suffix|DecimalPoint|MinusSign|Degrees|Minus|)ImageIndex(On|Off|Am|Pm|)":\s(2|3)\d\d/g;

$('jsonEditor-tab').addEventListener('click', () => init());
$('editor-export').addEventListener('click', () => exportjs());
$('jsoneditor-export').addEventListener('click', () => exportjs());
$('jsoneditor-undo').addEventListener('click', () => undo());
$('codearea').addEventListener('blur', () => codeareablur());

let buttons = $('.editor-button');
let click_toggle = e => {
    toggle(e.target.id.split('-')[1]);
};
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', click_toggle);
}