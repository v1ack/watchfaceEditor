/* global saveAs, UIkit */
import {
    $ as $
} from './utils.js';
import wfe from './wfe_obj.js';
import html2canvas from 'html2canvas';
import updateWatchface from './watchface_react';

function makeWf() {
    try {
        updateWatchface();
    } catch (error) {
        console.warn(error);
        if (error.name === "ImageError") {
            UIkit.notification(('imagenotfound' in wfe.app.lang ? wfe.app.lang.imagenotfound : "Image with index $index not found").replace("$index", "<b>" + error.imageIndex + "</b>"), {
                timeout: 7500,
                status: 'danger',
                pos: 'top-left'
                
            });
        }
        if (error.name === "TypeError") {
            UIkit.notification("Image for prorety not found", {
                timeout: 7500,
                status: 'danger',
                pos: 'top-left'
            });
        }
    }
}

let changes = {
    time_change: () => {
        let t = $("in-time").value.split(":");
        wfe.data.timeOnClock[0] = t[0];
        wfe.data.timeOnClock[1] = t[1];
        wfe.data.analog[0] = (t[0] > 12 ? t[0] - 12 : t[0]) * 30 + t[1] * 0.5;
        wfe.data.analog[1] = t[1] * 6;
        updateWatchface();
    },
    date_change: () => {
        let t = $("in-date").valueAsDate || new Date($("in-date").value);
        try {
            wfe.data.day = t.getUTCDate();
            wfe.data.month = t.getUTCMonth() + 1;
            wfe.data.weekDay = t.getUTCDay() > 0 ? t.getUTCDay() - 1 : 6;
            updateWatchface();
        } catch (e) {
            console.warn(e);
        }
    },
    sec_change: () => {
        if ($("in-sec").value > 59) $("in-sec").value = 59;
        if ($("in-sec").value < 0) $("in-sec").value = 0;
        let sec = $("in-sec").value;
        wfe.data.seconds[0] = Number(sec.split("")[0]);
        wfe.data.seconds[1] = Number((sec.split("").length === 1 ? 0 : sec.split("")[1]));
        wfe.data.analog[2] = sec * 6;
        updateWatchface();
    },
    battery_change: () => {
        if ($("in-battery").value > 100) $("in-battery").value = 100;
        if ($("in-battery").value < 0) $("in-battery").value = 0;
        wfe.data.battery = $("in-battery").value;
        updateWatchface();
    },
    alarm_change: () => {
        wfe.data.alarm = $("in-alarm").checked;
        updateWatchface();
    },
    bt_change: () => {
        wfe.data.bluetooth = $("in-bt").checked;
        updateWatchface();
    },
    dnd_change: () => {
        wfe.data.dnd = $("in-dnd").checked;
        updateWatchface();
    },
    lock_change: () => {
        wfe.data.lock = $("in-lock").checked;
        updateWatchface();
    },
    weatherAlt_change: () => {
        wfe.data.weatherAlt = $('in-weatherAlt').checked;
        updateWatchface();
    },
    steps_change: () => {
        if ($("in-steps").value > 99999) $("in-steps").value = 99999;
        if ($("in-steps").value < 0) $("in-steps").value = 0;
        wfe.data.steps = parseInt($("in-steps").value, 10);
        updateWatchface();
    },
    distance_change: () => {
        if ($("in-distance").value > 99) $("in-distance").value = 99;
        if ($("in-distance").value < 0) $("in-distance").value = 0;
        let dist = $("in-distance").value.split(".");
        wfe.data.distance[0] = Number(dist[0]);
        wfe.data.distance[1] = dist.length > 1 ? dist[1].slice(0, 2) : "00";
        updateWatchface();
    },
    pulse_change: () => {
        if ($("in-pulse").value > 999) $("in-pulse").value = 999;
        if ($("in-pulse").value < 0) $("in-pulse").value = 0;
        wfe.data.pulse = $("in-pulse").value;
        updateWatchface();
    },
    calories_change: () => {
        if ($("in-calories").value > 9999) $("in-calories").value = 9999;
        if ($("in-calories").value < 0) $("in-calories").value = 0;
        wfe.data.calories = $("in-calories").value;
        updateWatchface();
    },
    stepsGoal_change: () => {
        if ($("in-stepsGoal").value > 99999) $("in-stepsGoal").value = 99999;
        if ($("in-stepsGoal").value < 0) $("in-stepsGoal").value = 0;
        wfe.data.stepsGoal = parseInt($("in-stepsGoal").value, 10);
        updateWatchface();
    },
    weatherd_change: () => {
        if ($("in-weatherd").value > 199) $("in-weatherd").value = 199;
        if ($("in-weatherd").value < -99) $("in-weatherd").value = -99;
        wfe.data.temp[0] = $("in-weatherd").value;
        updateWatchface();
    },
    weathern_change: () => {
        if ($("in-weathern").value > 199) $("in-weathern").value = 199;
        if ($("in-weathern").value < -99) $("in-weathern").value = -99;
        wfe.data.temp[1] = $("in-weathern").value;
        updateWatchface();
    },
    air_change: () => {
        if ($("in-air").value > 500) $("in-air").value = 500;
        if ($("in-air").value < 0) $("in-air").value = 0;
        wfe.data.air = $("in-air").value;
        updateWatchface();
    },
    weathericon_change: () => {
        if ($("in-weathericon").value > 26) $("in-weathericon").value = 26;
        if ($("in-weathericon").value < 1) $("in-weathericon").value = 1;
        wfe.data.weathericon = $("in-weathericon").value - 1;
        updateWatchface();
    },
    animation_change: () => {
        if ($("in-animation").value > wfe.coords.Animation.AnimationImage.ImageCount)
            $("in-animation").value = wfe.coords.Animation.AnimationImage.ImageCount;
        if ($("in-animation").value < 1) $("in-animation").value = 1;
        wfe.data.animation = $("in-animation").value - 1;
        updateWatchface();
    }
};

function cleaner(imageData) {
    let pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i],
            g = pixels[i + 1],
            b = pixels[i + 2];
        pixels[i] = (r > 127 ? 255 : 0);
        pixels[i + 1] = (g > 127 ? 255 : 0);
        pixels[i + 2] = (b > 127 ? 255 : 0);
    }
    return imageData;
}

window.html2canvas = html2canvas;
function makepng() {
    let el = 'watchface';
    if ($('makepngwithwatch').checked)
        el = 'watchfaceimage';
    window.scrollTo(0, 0);
    html2canvas($(el), {
        allowTaint: true,
        scale: 1,
        useCORS: true,
        scrollY: 0,
        scrollX: -4
    }).then(canvas => {
        if (wfe.device.name === 'bip' && !($('makepngwithwatch').checked)) {
            let ctx = canvas.getContext('2d');
            ctx.putImageData(cleaner(ctx.getImageData(0, 0, canvas.width, canvas.height)), 0, 0);
        }
        if (wfe.app.notWebkitBased) {
            canvas.toBlob(function(blob) {
                saveAs(blob, wfe.data.wfname + '.png');
            });
        } else {
            let a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = wfe.data.wfname + '.png';
            a.click();
            a = null;
        }
    });
}

function makePreview() {
    window.scrollTo(0, 0);
    html2canvas($('watchfaceimage'), {
        allowTaint: true,
        scale: 1
    }).then(canvas => {
        $('realsizePreview').innerHTML = '';
        $('realsizePreview').appendChild(canvas);
        console.log('done');
    });
}

$('real_size_preview_button').addEventListener('click', makePreview);
$('makepng').addEventListener('click', makepng);
let elements = ['time', 'date', 'battery', 'calories', 'steps', 'stepsGoal', 'pulse', 'distance', 'weatherd', 'weathern', 'weathericon', 'sec', 'alarm', 'bt', 'dnd', 'lock', 'weatherAlt', 'air', 'animation'];
for (let i in elements) {
    $('in-' + elements[i]).addEventListener('change', changes[elements[i] + '_change']);
}

wfe.makeWf = makeWf;