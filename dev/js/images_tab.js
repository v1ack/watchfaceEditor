import {$, $c} from './utils.js';
import wfe from './wfe_obj.js';
/**
 * Renders image tab
 *
 * @param {object} coords wfe.coords object
 * @returns {undefined}
 */
function init(coords) {
    //    if (!('imagestabversion' in localStorage) || localStorage.imagestabversion < wfe.app.imagestabversion)
    //        localStorage.imagestabversion = wfe.app.imagestabversion;
    $("imagesinuse").innerHTML = '';
    $("imagesavalible").innerHTML = '';
    if ('bg' in coords)
        insertimg({
            label: "Background"
        }, coords.bg.Image.ImageIndex);
    if ('time' in coords) {
        insertimg({
            label: "Time hours tens"
        }, coords.time.Hours.Tens.ImageIndex, coords.time.Hours.Tens.ImagesCount);
        insertimg({
            label: "Time hours ones"
        }, coords.time.Hours.Ones.ImageIndex, coords.time.Hours.Ones.ImagesCount);
        insertimg({
            label: "Time minutes tens"
        }, coords.time.Minutes.Tens.ImageIndex, coords.time.Minutes.Tens.ImagesCount);
        insertimg({
            label: "Time minutes ones"
        }, coords.time.Minutes.Ones.ImageIndex, coords.time.Minutes.Ones.ImagesCount);
        if ('seconds' in coords) {
            insertimg({
                label: "Time seconds tens"
            }, coords.seconds.Tens.ImageIndex, coords.seconds.Tens.ImagesCount);
            insertimg({
                label: "Time seconds ones"
            }, coords.seconds.Ones.ImageIndex, coords.seconds.Ones.ImagesCount);
        }
        if ('amPm' in coords)
            insertimg({
                label: "Time am/pm"
            }, coords.amPm.ImageIndexAm, 1, coords.amPm.ImageIndexPm);
    }
    if (coords.date) {
        if ('dateWeekday' in coords) {
            insertimg({
                label: "Week day"
            }, coords.dateWeekday.ImageIndex, coords.dateWeekday.ImagesCount);
        }
        if ('dateDay' in coords) {
            insertimg({
                label: "Date day"
            }, coords.dateDay.ImageIndex, coords.dateDay.ImagesCount);
        }
        if ('dateMonth' in coords) {
            insertimg({
                label: "Date month"
            }, coords.dateMonth.ImageIndex, coords.dateMonth.ImagesCount);
        }
        if ('dateOneLine' in coords) {
            insertimg({
                label: "Date oneline",
                addition: (", " + coords.dateOneLine.DelimiterImageIndex)
            }, coords.dateOneLine.Number.ImageIndex, coords.dateOneLine.Number.ImagesCount, coords.dateOneLine.DelimiterImageIndex);
        }
    }
    if (coords.battery) {
        if ('batteryIcon' in coords)
            insertimg({
                label: "Battery icon"
            }, coords.batteryIcon.ImageIndex, coords.batteryIcon.ImagesCount);
        if ('batteryText' in coords)
            insertimg({
                label: "Battery text"
            }, coords.batteryText.ImageIndex, coords.batteryText.ImagesCount);
        if ('batteryScale' in coords)
            insertimg({
                label: "Battery scale"
            }, coords.batteryScale.StartImageIndex, coords.batteryScale.Segments.length);
    }
    if (coords.status) {
        if ('statAlarm' in coords)
            insertimg({
                label: "Status alarm",
                addition: (", " + coords.statAlarm.ImageIndexOff)
            }, coords.statAlarm.ImageIndexOn, 1, coords.statAlarm.ImageIndexOff);
        if ('statBluetooth' in coords)
            insertimg({
                label: "Status bluetooth",
                addition: (", " + coords.statBluetooth.ImageIndexOff)
            }, coords.statBluetooth.ImageIndexOn, 1, coords.statBluetooth.ImageIndexOff);
        if ('statDnd' in coords)
            insertimg({
                label: "Status do not disturb",
                addition: (", " + coords.statDnd.ImageIndexOff)
            }, coords.statDnd.ImageIndexOn, 1, coords.statDnd.ImageIndexOff);
        if ('statLock' in coords)
            insertimg({
                label: "Status lock",
                addition: (", " + coords.statLock.ImageIndexOff)
            }, coords.statLock.ImageIndexOn, 1, coords.statLock.ImageIndexOff);
    }
    if (coords.activity) {
        if ('actCalories' in coords)
            insertimg({
                label: "Activity calories"
            }, coords.actCalories.ImageIndex, coords.actCalories.ImagesCount);
        if ('actSteps' in coords)
            insertimg({
                label: "Activity steps"
            }, coords.actSteps.ImageIndex, coords.actSteps.ImagesCount);
        if ('statstepsGoal' in coords)
            insertimg({
                label: "Activity steps goal"
            }, coords.actStepsGoal.ImageIndex, coords.actStepsGoal.ImagesCount);
        if ('actPulse' in coords)
            insertimg({
                label: "Activity pulse"
            }, coords.actPulse.ImageIndex, coords.actPulse.ImagesCount);
        if ('actDistance' in coords)
            insertimg({
                label: "Activity distance",
                addition: (", " + coords.actDistance.DecimalPointImageIndex + ", " + coords.actDistance.SuffixImageIndex)
            }, coords.actDistance.Number.ImageIndex, coords.actDistance.Number.ImagesCount, coords.actDistance.DecimalPointImageIndex, coords.actDistance.SuffixImageIndex);
    }
    if (coords.weather) {
        if (coords.weathericon)
            if ('CustomIcon' in coords.weathericon) {
                insertimg({
                    label: "Weather icons"
                }, coords.weathericon.CustomIcon.ImageIndex, coords.weathericon.CustomIcon.ImagesCount);
            }
        if ('weatherOneLine' in coords)
            insertimg({
                label: "Weather oneline",
                addition: (", " + coords.weatherOneLine.MinusSignImageIndex + ", " + coords.weatherOneLine.DelimiterImageIndex + ", " + coords.weatherOneLine.DegreesImageIndex)
            }, coords.weatherOneLine.Number.ImageIndex, coords.weatherOneLine.Number.ImagesCount, coords.weatherOneLine.MinusSignImageIndex, coords.weatherOneLine.DelimiterImageIndex, coords.weatherOneLine.DegreesImageIndex);
        if ('weatherDay' in coords)
            insertimg({
                label: "Weather day",
                addition: (", " + coords.weatherDay.MinusImageIndex)
            }, coords.weatherDay.Number.ImageIndex, coords.weatherDay.Number.ImagesCount, coords.weatherDay.MinusImageIndex);
        if ('weatherNight' in coords)
            insertimg({
                label: "Weather night",
                addition: (", " + coords.weatherNight.MinusImageIndex)
            }, coords.weatherNight.Number.ImageIndex, coords.weatherNight.Number.ImagesCount, coords.weatherNight.MinusImageIndex);

        if ('weatherCurrent' in coords)
            insertimg({
                label: "Weather current",
                addition: (", " + coords.weatherCurrent.MinusImageIndex + ", " + coords.weatherCurrent.DegreesImageIndex)
            }, coords.weatherCurrent.Number.ImageIndex, coords.weatherCurrent.Number.ImagesCount, coords.weatherCurrent.MinusImageIndex, coords.weatherCurrent.DegreesImageIndex);
        if ('weatherAirIcon' in coords)
            insertimg({
                label: "Weather air pollution"
            }, coords.weatherAirIcon.ImageIndex, coords.weatherAirIcon.ImagesCount);
    }
    if (coords.stepsprogress) {
        if ('stepsLinear' in coords)
            insertimg({
                label: "Steps progress"
            }, coords.stepsLinear.StartImageIndex, coords.stepsLinear.Segments.length);
        if ('stepsGoal' in coords)
            insertimg({
                label: "Goal image"
            }, coords.stepsGoal.ImageIndex, 1);
    }
    insertimg({
        label: "Big digits",
        insertto: "imagesavalible"
    }, 255, 10);
    insertimg({
        label: "Digits",
        insertto: "imagesavalible"
    }, 200, 10);
    insertimg({
        label: "Week days",
        insertto: "imagesavalible"
    }, 210, 7);
    insertimg({
        label: "Week days russian",
        insertto: "imagesavalible"
    }, 241, 7);
    insertimg({
        label: "Week days russian inverted",
        insertto: "imagesavalible"
    }, 248, 7);
    insertimg({
        label: "Week days finnish",
        insertto: "imagesavalible"
    }, 294, 7);
    insertimg({
        label: "Battery icon",
        insertto: "imagesavalible"
    }, 225, 6);
    insertimg({
        label: "Air pollution",
        insertto: "imagesavalible"
    }, 235, 6);
    insertimg({
        label: "Weather symbols",
        insertto: "imagesavalible",
        addition: ", 218, 219"
    }, 217, 3);
    insertimg({
        label: "Bluetooth",
        insertto: "imagesavalible",
        addition: ", 221"
    }, 220, 2);
    insertimg({
        label: "Distance symbols",
        insertto: "imagesavalible",
        addition: ", 232"
    }, 231, 2);
    insertimg({
        label: "Am/Pm",
        insertto: "imagesavalible",
        addition: ", 234"
    }, 233, 2);
    insertimg({
        label: "Status images",
        insertto: "imagesavalible",
        addition: ", 223, 224"
    }, 222, 3);
    insertimg({
        label: "Steps goal image",
        insertto: "imagesavalible"
    }, 266, 1);
    insertimg({
        label: "Weather icons",
        insertto: "imagesavalible"
    }, 267, 26);
}
/**
 * Renders images
 *
 * @param {string} name image name
 * @param {number} imageindex index 
 * @param {number} imagescount count
 * @returns {undefined}
 */
function insertimg(name, imageindex, imagescount) {

    if (!('insertto' in name))
        name.insertto = "imagesinuse";
    if (!('addition' in name))
        name.addition = "";
    if (!imagescount) imagescount = 1;
    if (!imageindex) {
        imagescount = 0;
        imageindex = '';
        name.addition = name.addition.slice(2);
    }
    $(name.insertto).innerHTML += '<div class="imagessection"><div><span class="imagessection-h">' + name.label + '</span><span class="imagessection-description">ImageIndex: ' + imageindex + name.addition + '</span></div><div class="imagessection-images"></div></div>';
    if (((imageindex - imageindex % 100) / 100 === 2) || ((imageindex - imageindex % 100) / 100 === 3))
        $(name.insertto).lastChild.classList.add("imagessection-def");
    for (let i = 0; i < imagescount; i++) {
        $(name.insertto).lastChild.lastChild.appendChild($c(imageindex + i));
        $(name.insertto).lastChild.lastChild.lastChild.removeAttribute("id");
    }
    if (arguments.length > 3)
        for (let i = 3; i < arguments.length; i++) {
            $(name.insertto).lastChild.lastChild.appendChild($c(arguments[i]));
            $(name.insertto).lastChild.lastChild.lastChild.removeAttribute("id");
        }
}

$('resources-tab').addEventListener('click', () => init(wfe.coords));