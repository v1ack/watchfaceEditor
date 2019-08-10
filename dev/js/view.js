/* global saveAs, UIkit, html2canvas */
import {
    $ as $,
    $c as $c,
    div as div,
    removeByClass as removeByClass
} from './utils.js';
import wfe from './wfe_obj.js';
let draw = {
    time: {
        time: function() {
            let ntimeOnClock = wfe.data.timeOnClock[0];
            if ('amPm' in wfe.coords) {
                let am = 1;
                if (Number(ntimeOnClock) > 12) {
                    ntimeOnClock = (Number(ntimeOnClock) - 12).toString();
                    if (ntimeOnClock.length === 1)
                        ntimeOnClock = "0" + ntimeOnClock;
                    am = 0;
                } else if (Number(ntimeOnClock) === 12)
                    am = 0;
                let t = am ? $c(wfe.coords.amPm.ImageIndexAm) : $c(wfe.coords.amPm.ImageIndexPm);
                setPos(t, wfe.coords.amPm);
                insert(t, "c_time_am");

            }
            setPosN(wfe.coords.time.Hours.Tens, Number(ntimeOnClock[0]), "c_time");
            setPosN(wfe.coords.time.Hours.Ones, Number(ntimeOnClock[1]), "c_time");
            setPosN(wfe.coords.time.Minutes.Tens, Number(wfe.data.timeOnClock[1][0]), "c_time");
            setPosN(wfe.coords.time.Minutes.Ones, Number(wfe.data.timeOnClock[1][1]), "c_time");
            if ('DrawingOrder' in wfe.coords.time) {
                let time = document.getElementsByClassName("c_time");
                time[0].style.zIndex = Number(wfe.coords.time.DrawingOrder[0]);
                time[1].style.zIndex = Number(wfe.coords.time.DrawingOrder[1]);
                time[2].style.zIndex = Number(wfe.coords.time.DrawingOrder[2]);
                time[3].style.zIndex = Number(wfe.coords.time.DrawingOrder[3]);
            }
        },
        seconds: function() {
            setPosN(wfe.coords.seconds.Tens, wfe.data.seconds[0], "c_sec");
            setPosN(wfe.coords.seconds.Ones, wfe.data.seconds[1], "c_sec");
        }
    },
    date: {
        weekDay: function() {
            setPosN(wfe.coords.weekDay, wfe.data.weekDay, "c_date_weekDay");
        },
        sepday: function() {
            let t = makeBlock(wfe.coords.dateDay, wfe.data.day);
            if (wfe.coords.monthandday.TwoDigitsDay)
                if (!div(wfe.data.day, 10)) {
                    t.block.splice(-1, 0, $c(wfe.coords.dateDay.ImageIndex));
                    t.width += $(wfe.coords.dateDay.ImageIndex).width + wfe.coords.dateDay.Spacing;
                }
            renderBlock(t.block, t.width, wfe.coords.dateDay, "c_date_sepday");
        },
        sepmonth: function() {
            let t = makeBlock(wfe.coords.dateMonth, wfe.data.month);
            if (wfe.coords.monthandday.TwoDigitsMonth)
                if (!div(wfe.data.month, 10)) {
                    t.block.splice(-1, 0, $c(wfe.coords.dateMonth.ImageIndex));
                    t.width += $(wfe.coords.dateMonth.ImageIndex).width + wfe.coords.dateMonth.Spacing;
                }
            renderBlock(t.block, t.width, wfe.coords.dateMonth, "c_date_sepmonth");
        },
        oneline: function() {
            let dot = $c(wfe.coords.dateOneLine.DelimiterImageIndex);
            let t = makeBlock(wfe.coords.dateOneLine.Number, wfe.data.month);
            if (wfe.coords.monthandday.TwoDigitsMonth)
                if (!div(wfe.data.month, 10)) {
                    t.block.splice(-1, 0, $c(wfe.coords.dateOneLine.Number.ImageIndex));
                    t.width += $(wfe.coords.dateOneLine.Number.ImageIndex).width + wfe.coords.dateOneLine.Number.Spacing;
                }
            t.block.push(dot);
            t.width += dot.width + wfe.coords.dateOneLine.Number.Spacing;
            let t2 = makeBlock(wfe.coords.dateOneLine.Number, wfe.data.day);
            t.block = t.block.concat(t2.block);
            if (wfe.coords.monthandday.TwoDigitsDay)
                if (!div(wfe.data.day, 10)) {
                    t.block.splice(-1, 0, $c(wfe.coords.dateOneLine.Number.ImageIndex));
                    t.width += $(wfe.coords.dateOneLine.Number.ImageIndex).width + wfe.coords.dateOneLine.Number.Spacing;
                }
            t.width += t2.width;
            renderBlock(t.block, t.width, wfe.coords.dateOneLine.Number, "c_date_oneline");
        }

    },
    battery: {
        icon: function() {
            let battery = Math.round(wfe.data.battery / (100 / (wfe.coords.batteryIcon.ImagesCount - 1)));
            setPosN(wfe.coords.batteryIcon, battery, "c_battery_icon");
        },
        text: function() {
            setTextPos(wfe.coords.batteryText, wfe.data.battery, "c_battery_text");
        },
        scale: function() {
            let end = Math.ceil(wfe.data.battery / (100 / (wfe.coords.batteryScale.Segments.length - 1)));
            for (let i = 0; i <= end; i++) {
                let t = $c(wfe.coords.batteryScale.StartImageIndex + i);
                setPos(t, wfe.coords.batteryScale.Segments[i]);
                insert(t, "c_battery_scale");
            }
        }
    },
    analog: {
        hours: function() {
            drawAnalog(wfe.coords.analoghours, wfe.data.analog[0]);
        },
        minutes: function() {
            drawAnalog(wfe.coords.analogminutes, wfe.data.analog[1]);
        },
        seconds: function() {
            drawAnalog(wfe.coords.analogseconds, wfe.data.analog[2]);
        }
    },
    status: {
        alarm: function() {
            let t;
            if ('ImageIndexOff' in wfe.coords.statAlarm && !wfe.data.alarm)
                t = $c(wfe.coords.statAlarm.ImageIndexOff);
            else if ('ImageIndexOn' in wfe.coords.statAlarm && wfe.data.alarm)
                t = $c(wfe.coords.statAlarm.ImageIndexOn);
            else return;
            t.style.left = wfe.coords.statAlarm.Coordinates.X + "px";
            t.style.top = wfe.coords.statAlarm.Coordinates.Y + "px";
            insert(t, "c_stat_alarm");
        },
        bt: function() {
            let t;
            if ('ImageIndexOff' in wfe.coords.statBt && !wfe.data.bluetooth)
                t = $c(wfe.coords.statBt.ImageIndexOff);
            else if ('ImageIndexOn' in wfe.coords.statBt && wfe.data.bluetooth)
                t = $c(wfe.coords.statBt.ImageIndexOn);
            else return;
            t.style.left = wfe.coords.statBt.Coordinates.X + "px";
            t.style.top = wfe.coords.statBt.Coordinates.Y + "px";
            insert(t, "c_stat_bt");
        },
        dnd: function() {
            let t;
            if ('ImageIndexOff' in wfe.coords.statDnd && !wfe.data.dnd)
                t = $c(wfe.coords.statDnd.ImageIndexOff);
            else if ('ImageIndexOn' in wfe.coords.statDnd && wfe.data.dnd)
                t = $c(wfe.coords.statDnd.ImageIndexOn);
            else return;
            t.style.left = wfe.coords.statDnd.Coordinates.X + "px";
            t.style.top = wfe.coords.statDnd.Coordinates.Y + "px";
            insert(t, "c_stat_dnd");
        },
        lock: function() {
            let t;
            if ('ImageIndexOff' in wfe.coords.statLock && !wfe.data.lock)
                t = $c(wfe.coords.statLock.ImageIndexOff);
            else if ('ImageIndexOn' in wfe.coords.statLock && wfe.data.lock)
                t = $c(wfe.coords.statLock.ImageIndexOn);
            else return;
            t.style.left = wfe.coords.statLock.Coordinates.X + "px";
            t.style.top = wfe.coords.statLock.Coordinates.Y + "px";
            insert(t, "c_stat_lock");
        }
    },
    activity: {
        cal: function() {
            setTextPos(wfe.coords.actCal, wfe.data.calories, "c_act_cal", localStorage.device === 'cor');
        },
        steps: function() {
            setTextPos(wfe.coords.actSteps, wfe.data.steps, "c_act_steps", localStorage.device === 'cor');
        },
        stepsGoal: function() {
            setTextPos(wfe.coords.actStepsGoal, wfe.data.stepsGoal, "c_act_stepsg", localStorage.device === 'cor');
        },
        pulse: function() {
            setTextPos(wfe.coords.actPulse, wfe.data.pulse, "c_act_pulse", localStorage.device === 'cor');
        },
        distance: function() {
            let dot = $c(wfe.coords.actDistance.DecimalPointImageIndex),
                km = $c(wfe.coords.actDistance.SuffixImageIndex);
            let t = makeBlock(wfe.coords.actDistance.Number, wfe.data.distance[0]);
            t.block.push(dot);
            t.width += dot.width + wfe.coords.actDistance.Number.Spacing;
            let t2 = makeBlock(wfe.coords.actDistance.Number, wfe.data.distance[1]);
            t.block = t.block.concat(t2.block);
            t.width += t2.width;
            t.block.push(km);
            t.width += km.width;
            renderBlock(t.block, t.width, wfe.coords.actDistance.Number, "c_act_distance");
        }
    },
    stepsprogress: {
        circle: function() {
            let col = wfe.coords.stepscircle.Color.replace("0x", "#"),
                full = Math.floor(2 * wfe.coords.stepscircle.RadiusX * Math.PI / 360 * (wfe.coords.stepscircle.EndAngle - wfe.coords.stepscircle.StartAngle));
            let fill = Math.round(wfe.data.steps / (wfe.data.stepsGoal / full));
            if (fill > full) fill = full;
            $('svg-cont-steps').innerHTML += "<ellipse transform=\"rotate(" + (-90 + wfe.coords.stepscircle.StartAngle) + " " + wfe.coords.stepscircle.CenterX + " " + wfe.coords.stepscircle.CenterY + ")\" cx=\"" + wfe.coords.stepscircle.CenterX + "\" cy=\"" + wfe.coords.stepscircle.CenterY + "\" rx=\"" + wfe.coords.stepscircle.RadiusX + "\" ry=\"" + wfe.coords.stepscircle.RadiusY + "\" fill=\"rgba(255,255,255,0)\" stroke-width=\"" + wfe.coords.stepscircle.Width + "\" stroke=\"" + col + "\" stroke-dasharray=\"" + fill + " " + (full - fill) + "\" stroke-linecap=\"none\"></ellipse>";
        },
        linear: function() {
            let end = Math.floor(wfe.data.steps / (wfe.data.stepsGoal / (wfe.coords.stepsLinear.Segments.length))) - 1;
            if (end > wfe.coords.stepsLinear.Segments.length - 1)
                end = wfe.coords.stepsLinear.Segments.length - 1;
            for (let i = 0; i <= end; i++) {
                let t = $c(wfe.coords.stepsLinear.StartImageIndex + i);
                setPos(t, wfe.coords.stepsLinear.Segments[i]);
                insert(t, "c_steps_linear");
            }
        },
        goal: function() {
            if (wfe.data.steps >= wfe.data.stepsGoal)
                setPosN(wfe.coords.stepsGoal, 0, "c_steps_goal");
        }
    },
    weather: {
        icon: function() {
            if ('CustomIcon' in wfe.coords.weathericon) {
                let t = $c(wfe.coords.weathericon.CustomIcon.ImageIndex + wfe.data.weathericon);
                t.style.left = wfe.coords.weathericon.CustomIcon.X + "px";
                t.style.top = wfe.coords.weathericon.CustomIcon.Y + "px";
                insert(t, "c_weather_icon");
            } else {
                let t = $c("weather");
                t.style.left = wfe.coords.weathericon.Coordinates.X + "px";
                t.style.top = wfe.coords.weathericon.Coordinates.Y + "px";
                insert(t, "c_weather_icon");
            }
        },
        temp: {
            oneline: function() {
                let sep = $c(wfe.coords.weatherOneLine.DelimiterImageIndex),
                    deg = $c(wfe.coords.weatherOneLine.DegreesImageIndex),
                    minus = wfe.data.temp[0] < 0 ? $c(wfe.coords.weatherOneLine.MinusSignImageIndex) : 0;
                let t = makeBlock(wfe.coords.weatherOneLine.Number, Math.abs(wfe.data.temp[0]));
                if (minus !== 0) {
                    t.block.splice(0, 0, minus);
                    t.width += minus.width;
                }
                t.block.push(sep);
                t.width += sep.width + wfe.coords.weatherOneLine.Number.Spacing;
                let t2 = makeBlock(wfe.coords.weatherOneLine.Number, Math.abs(wfe.data.temp[1]));
                minus = wfe.data.temp[1] < 0 ? $c(wfe.coords.weatherOneLine.MinusSignImageIndex) : 0;
                if (minus !== 0) {
                    t2.block.splice(0, 0, minus);
                    t2.width += minus.width;
                }
                t.block = t.block.concat(t2.block);
                t.width += t2.width;
                t.block.push(deg);
                t.width += deg.width;
                renderBlock(t.block, t.width, wfe.coords.weatherOneLine.Number, "c_temp_oneline");
            },
            sep: {
                day: function() {
                    if (wfe.data.weatherAlt)
                        return;
                    let minus = wfe.data.temp[0] < 0 ? $c(wfe.coords.weatherDay.MinusImageIndex) : 0;
                    let t = makeBlock(wfe.coords.weatherDay.Number, Math.abs(wfe.data.temp[0]));
                    if ('DegreesImageIndex' in wfe.coords.weatherDay) {
                        let deg = $c(wfe.coords.weatherDay.DegreesImageIndex);
                        t.block.push(deg);
                        t.width += deg.width + wfe.coords.weatherDay.Number.Spacing;
                    }
                    if (minus !== 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    renderBlock(t.block, t.width, wfe.coords.weatherDay.Number, "c_temp_sep_day");
                },
                night: function() {
                    if (wfe.data.weatherAlt)
                        return;
                    let minus = wfe.data.temp[1] < 0 ? $c(wfe.coords.weatherNight.MinusImageIndex) : 0;
                    let t = makeBlock(wfe.coords.weatherNight.Number, Math.abs(wfe.data.temp[1]));
                    if ('DegreesImageIndex' in wfe.coords.weatherNight) {
                        let deg = $c(wfe.coords.weatherNight.DegreesImageIndex);
                        t.block.push(deg);
                        t.width += deg.width + wfe.coords.weatherNight.Number.Spacing;
                    }
                    if (minus !== 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    renderBlock(t.block, t.width, wfe.coords.weatherNight.Number, "c_temp_sep_night");
                },
                dayAlt: function() {
                    if (!wfe.data.weatherAlt)
                        return;
                    let minus = wfe.data.temp[0] < 0 ? $c(wfe.coords.weatherDay.MinusImageIndex) : 0;
                    let t = makeBlock(wfe.coords.weatherDay.Number, Math.abs(wfe.data.temp[0]));
                    if ('DegreesImageIndex' in wfe.coords.weatherDay) {
                        let deg = $c(wfe.coords.weatherDay.DegreesImageIndex);
                        t.block.push(deg);
                        t.width += deg.width + wfe.coords.weatherDay.Number.Spacing;
                    }
                    if (minus !== 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    renderBlock(t.block, t.width, wfe.coords.weatherDayAlt.Number, "c_temp_sep_day_alt");
                },
                nightAlt: function() {
                    if (!wfe.data.weatherAlt)
                        return;
                    let minus = wfe.data.temp[1] < 0 ? $c(wfe.coords.weatherNight.MinusImageIndex) : 0;
                    let t = makeBlock(wfe.coords.weatherNight.Number, Math.abs(wfe.data.temp[1]));
                    if ('DegreesImageIndex' in wfe.coords.weatherNight) {
                        let deg = $c(wfe.coords.weatherNight.DegreesImageIndex);
                        t.block.push(deg);
                        t.width += deg.width + wfe.coords.weatherNight.Number.Spacing;
                    }
                    if (minus !== 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    renderBlock(t.block, t.width, wfe.coords.weatherNightAlt.Number, "c_temp_sep_night_alt");
                }
            },
            current: function() {
                if (wfe.data.weatherAlt)
                    return;
                let minus = wfe.data.temp[0] < 0 ? $c(wfe.coords.weatherCurrent.MinusImageIndex) : 0;
                let t = makeBlock(wfe.coords.weatherCurrent.Number, Math.abs(wfe.data.temp[0]));
                if ('DegreesImageIndex' in wfe.coords.weatherCurrent) {
                    let deg = $c(wfe.coords.weatherCurrent.DegreesImageIndex);
                    t.block.push(deg);
                    t.width += deg.width + wfe.coords.weatherCurrent.Number.Spacing;
                }
                if (minus !== 0) {
                    t.block.splice(0, 0, minus);
                    t.width += minus.width;
                }
                renderBlock(t.block, t.width, wfe.coords.weatherCurrent.Number, "c_temp_cur");
            }
        },
        airIcon: function() {
            setPosN(wfe.coords.weatherAirIcon, 0, "c_air_icon");
        },
        airText: function() {
            //setTextPos(wfe.elements['weatherAirText'].coords, 153, wfe.elements['weatherAirText'].prewiewClass);
            setTextPos(wfe.coords.weatherAirText, wfe.data.air, "c_air_text");
        }
    },
    Animation: () => {
        setPosN(wfe.coords.Animation.AnimationImage, wfe.data.animation, 'c_animation');
    }
};

function drawAnalog(el, value) {
    let col = el.Color.replace("0x", "#"),
        d = "M " + el.Shape[0].X + " " + el.Shape[0].Y,
        iters = el.Shape.length,
        fill = el.OnlyBorder ? "none" : col;
    for (let i = 0; i < iters; i++) {
        d += "L " + el.Shape[i].X + " " + el.Shape[i].Y + " ";
    }
    d += "L " + el.Shape[0].X + " " + el.Shape[0].Y + " ";
    $('svg-cont-clock').innerHTML += '<path d="' + d + '" transform="rotate(' + (value - 90) + ' ' + el.Center.X + ' ' + el.Center.Y + ') translate(' + el.Center.X + " " + el.Center.Y + ') " fill="' + fill + '" stroke="' + col + '"></path>';
    if ('CenterImage' in el) {
        setPosN(el.CenterImage, 0, "c_an_img");
    }
}

function setTextPos(el, value, cls, cor) {
    let t = makeBlock(el, value);
    if (cor) {
        if ('PrefixImageIndex' in el.cor) {
            let image = $c(el.cor.PrefixImageIndex);
            t.block.splice(0, 0, image);
            t.width += image.width + el.Spacing;
        }
        if ('SuffixImageIndex' in el.cor) {
            let image = $c(el.cor.SuffixImageIndex);
            t.block.push(image);
            t.width += image.width + el.Spacing;
        }
        if ('EmptyImageIndex' in el.cor && value === 0) {
            let image = $c(el.cor.EmptyImageIndex);
            t.block = [image];
            t.width = image.width;
        }
    }
    renderBlock(t.block, t.width, el, cls);
}

function insert(t, name) {
    t.removeAttribute('id');
    t.classList.add(name);
    $("watchface").appendChild(t);
}

function setPosN(el, value, cls) {
    let t = $c(el.ImageIndex + value);
    t.style.left = el.X + "px";
    t.style.top = el.Y + "px";
    insert(t, cls);
}

function setPos(t, el) {
    t.style.left = el.X + "px";
    t.style.top = el.Y + "px";
}

function makeWf() {
    try {
        $("watchface").innerHTML = '';
        $("svg-cont-clock").innerHTML = '';
        $("svg-cont-steps").innerHTML = '';
        //UIkit.notification.closeAll()
        if (localStorage.device === 'cor') {
            setPosN({
                ImageIndex: 293,
                X: 0,
                Y: 0
            }, 0, "wf_bg");
        } else
            setPosN({
                ImageIndex: 265,
                X: 0,
                Y: 0
            }, 0, "wf_bg");
        document.getElementsByClassName('wf_bg')[0].classList.remove('default-image');
        if ('bg' in wfe.coords)
            setPosN(wfe.coords.bg.Image, 0, "c_bg");
        if ('time' in wfe.coords)
            draw.time.time();
        if ('seconds' in wfe.coords)
            draw.time.seconds();
        if (wfe.coords.date) {
            if ('weekDay' in wfe.coords)
                draw.date.weekDay();
            if ('dateDay' in wfe.coords)
                draw.date.sepday();
            if ('dateMonth' in wfe.coords)
                draw.date.sepmonth();
            if ('dateOneLine' in wfe.coords)
                draw.date.oneline();
        }
        if (wfe.coords.battery) {
            if ('batteryIcon' in wfe.coords)
                draw.battery.icon();
            if ('batteryText' in wfe.coords)
                draw.battery.text();
            if ('batteryScale' in wfe.coords)
                draw.battery.scale();
        }
        if (wfe.coords.status) {
            if ('statAlarm' in wfe.coords)
                draw.status.alarm();
            if ('statBt' in wfe.coords)
                draw.status.bt();
            if ('statDnd' in wfe.coords)
                draw.status.dnd();
            if ('statLock' in wfe.coords)
                draw.status.lock();
        }
        if (wfe.coords.activity) {
            if ('actCal' in wfe.coords)
                draw.activity.cal();
            if ('actSteps' in wfe.coords)
                draw.activity.steps();
            if ('actStepsGoal' in wfe.coords)
                draw.activity.stepsGoal();
            if ('actPulse' in wfe.coords)
                draw.activity.pulse();
            if ('actDistance' in wfe.coords)
                draw.activity.distance();
        }
        if (wfe.coords.weather) {
            if ('weathericon' in wfe.coords)
                draw.weather.icon();
            if ('weatherOneLine' in wfe.coords)
                draw.weather.temp.oneline();
            if ('weatherDay' in wfe.coords)
                draw.weather.temp.sep.day();
            if ('weatherNight' in wfe.coords)
                draw.weather.temp.sep.night();
            if ('weatherDayAlt' in wfe.coords)
                draw.weather.temp.sep.dayAlt();
            if ('weatherNightAlt' in wfe.coords)
                draw.weather.temp.sep.nightAlt();
            if ('weatherCurrent' in wfe.coords)
                draw.weather.temp.current();
            if ('weatherAirIcon' in wfe.coords)
                draw.weather.airIcon();
            if ('weatherAirText' in wfe.coords)
                draw.weather.airText();
        }
        if (wfe.coords.stepsprogress) {
            if ('stepscircle' in wfe.coords)
                draw.stepsprogress.circle();
            if ('stepsLinear' in wfe.coords)
                draw.stepsprogress.linear();
            if ('stepsGoal' in wfe.coords && wfe.data.steps >= wfe.data.stepsGoal)
                draw.stepsprogress.goal();
        }
        if (wfe.coords.analog) {
            if ('analoghours' in wfe.coords)
                draw.analog.hours();
            if ('analogminutes' in wfe.coords)
                draw.analog.minutes();
            if ('analogseconds' in wfe.coords)
                draw.analog.seconds();
        }
        if (wfe.coords.Animation) {
            draw.Animation();
        }
    } catch (error) {
        console.warn(error);
        if (error.name === "ImageError") {
            UIkit.notification(('imagenotfound' in wfe.app.lang ? wfe.app.lang.imagenotfound : "Image with index $index not found").replace("$index", "<b>" + error.imageIndex + "</b>"), {
                status: 'danger',
                pos: 'top-left',
                timeout: 7500
            });
        }
        if (error.name === "TypeError") {
            UIkit.notification("Image for prorety not found", {
                status: 'danger',
                pos: 'top-left',
                timeout: 7500
            });
        }
    }
}

function renderBlock(block, width, el, cls) {
    let t, offset = 0,
        topoffset;
    switch (el.Alignment) {
        case 18:
        case "TopLeft":
            block.reverse();
            while (block.length) {
                t = block.pop();
                t.style.left = el.TopLeftX + offset + "px";
                t.style.top = el.TopLeftY + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        case 24:
        case "TopCenter":
        case "Top":
            block.reverse();
            offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
            while (block.length) {
                t = block.pop();
                t.style.left = el.TopLeftX + offset + "px";
                t.style.top = el.TopLeftY + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        case 20:
        case "TopRight":
            while (block.length) {
                t = block.pop();
                t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                t.style.top = el.TopLeftY + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        case 66:
        case "CenterLeft":
        case 'Left':
            block.reverse();
            topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
            while (block.length) {
                t = block.pop();
                t.style.left = el.TopLeftX + offset + "px";
                t.style.top = el.TopLeftY + topoffset + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        case 72:
        case "Center":
        case "VCenter":
        case "HCenter":
            block.reverse();
            offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
            topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
            while (block.length) {
                t = block.pop();
                t.style.left = el.TopLeftX + offset + "px";
                t.style.top = el.TopLeftY + topoffset + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        case 68:
        case "CenterRight":
        case "Right":
            topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
            while (block.length) {
                t = block.pop();
                t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                t.style.top = el.TopLeftY + topoffset + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        case 34:
        case "BottomLeft":
            block.reverse();
            while (block.length) {
                t = block.pop();
                t.style.left = el.TopLeftX + offset + "px";
                t.style.top = el.BottomRightY - t.height + 1 + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        case 40:
        case "BottomCenter":
        case "Bottom":
            block.reverse();
            offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
            while (block.length) {
                t = block.pop();
                t.style.left = el.TopLeftX + offset + "px";
                t.style.top = el.BottomRightY - t.height + 1 + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        case 36:
        case "BottomRight":
            while (block.length) {
                t = block.pop();
                t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                t.style.top = el.BottomRightY - t.height + 1 + "px";
                insert(t, cls);
                offset += t.width + el.Spacing;
            }
            break;
        default:
            UIkit.notification("Alignment <b>(" + el.Alignment + ")</b> is incorrect. You made a mistake", {
                status: 'danger',
                pos: 'top-left',
                timeout: 7500
            });
    }
}

function makeBlock(el, value) {
    value = value.toString();
    let block = Array(),
        width = 0,
        t;
    while (value !== "") {
        t = $c(el.ImageIndex + Number(value[0]));
        block.push(t);
        width += t.width + el.Spacing;
        value = value.substr(1);
    }
    width = width - el.Spacing;
    return {
        block: block,
        width: width
    };
}

let changes = {
    time_change: () => {
        let t = $("in-time").value.split(":");
        wfe.data.timeOnClock[0] = t[0];
        wfe.data.timeOnClock[1] = t[1];
        wfe.data.analog[0] = (t[0] > 12 ? t[0] - 12 : t[0]) * 30 + t[1] * 0.5;
        wfe.data.analog[1] = t[1] * 6;
        $("svg-cont-clock").innerHTML = '';
        if ('analog' in wfe.coords) {
            if ('analoghours' in wfe.coords)
                draw.analog.hours();
            if ('analogminutes' in wfe.coords)
                draw.analog.minutes();
            if ('analogseconds' in wfe.coords)
                draw.analog.seconds();
        }
        removeByClass("c_time");
        if ('time' in wfe.coords)
            draw.time.time();
    },
    date_change: () => {
        let t = $("in-date").valueAsDate || new Date($("in-date").value);
        try {
            wfe.data.day = t.getUTCDate();
            wfe.data.month = t.getUTCMonth() + 1;
            wfe.data.weekDay = t.getUTCDay() > 0 ? t.getUTCDay() - 1 : 6;
            removeByClass("c_date_sepday");
            removeByClass("c_date_weekDay");
            removeByClass("c_date_sepmonth");
            removeByClass("c_date_oneline");
            if (wfe.coords.date) {
                if ('weekDay' in wfe.coords)
                    draw.date.weekDay();
                if ('dateDay' in wfe.coords)
                    draw.date.sepday();
                if ('dateMonth' in wfe.coords)
                    draw.date.sepmonth();
                if ('dateOneLine' in wfe.coords)
                    draw.date.oneline();
            }
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
        $("svg-cont-clock").innerHTML = '';
        if ('analog' in wfe.coords) {
            if ('analoghours' in wfe.coords)
                draw.analog.hours();
            if ('analogminutes' in wfe.coords)
                draw.analog.minutes();
            if ('analogseconds' in wfe.coords)
                draw.analog.seconds();
        }
        removeByClass("c_sec");
        if ('time' in wfe.coords)
            if ('seconds' in wfe.coords)
                draw.time.seconds();
    },
    battery_change: () => {
        if ($("in-battery").value > 100) $("in-battery").value = 100;
        if ($("in-battery").value < 0) $("in-battery").value = 0;
        wfe.data.battery = $("in-battery").value;
        removeByClass("c_battery_icon");
        removeByClass("c_battery_scale");
        removeByClass("c_battery_text");
        if (wfe.coords.battery) {
            if ('batteryIcon' in wfe.coords)
                draw.battery.icon();
            if ('batteryText' in wfe.coords)
                draw.battery.text();
            if ('batteryScale' in wfe.coords)
                draw.battery.scale();
        }
    },
    alarm_change: () => {
        wfe.data.alarm = $("in-alarm").checked;
        removeByClass("c_stat_alarm");
        if (wfe.coords.status)
            if ('statAlarm' in wfe.coords)
                draw.status.alarm();
    },
    bt_change: () => {
        wfe.data.bluetooth = $("in-bt").checked;
        removeByClass("c_stat_bt");
        if (wfe.coords.status)
            if ('statBt' in wfe.coords)
                draw.status.bt();
    },
    dnd_change: () => {
        wfe.data.dnd = $("in-dnd").checked;
        removeByClass("c_stat_dnd");
        if (wfe.coords.status)
            if ('statDnd' in wfe.coords)
                draw.status.dnd();
    },
    lock_change: () => {
        wfe.data.lock = $("in-lock").checked;
        removeByClass("c_stat_lock");
        if (wfe.coords.status)
            if ('statLock' in wfe.coords)
                draw.status.lock();
    },
    weatherAlt_change: () => {
        wfe.data.weatherAlt = $('in-weatherAlt').checked;
        if (wfe.data.weatherAlt) {
            removeByClass("c_temp_sep_day");
            removeByClass("c_temp_sep_night");
            removeByClass("c_temp_cur");
            if ('weatherDayAlt' in wfe.coords)
                draw.weather.temp.sep.dayAlt();
            if ('weatherNightAlt' in wfe.coords)
                draw.weather.temp.sep.nightAlt();
        } else {
            removeByClass("c_temp_sep_night_alt");
            removeByClass("c_temp_sep_day_alt");
            if ('weatherDay' in wfe.coords)
                draw.weather.temp.sep.day();
            if ('weatherNight' in wfe.coords)
                draw.weather.temp.sep.night();
            if ('weatherCurrent' in wfe.coords)
                draw.weather.temp.current();
        }
    },
    steps_change: () => {
        if ($("in-steps").value > 99999) $("in-steps").value = 99999;
        if ($("in-steps").value < 0) $("in-steps").value = 0;
        wfe.data.steps = parseInt($("in-steps").value);
        removeByClass("c_act_steps");
        if (wfe.coords.activity)
            if ('actSteps' in wfe.coords)
                draw.activity.steps();
        removeByClass("c_steps_linear");
        removeByClass("c_steps_goal");
        $("svg-cont-steps").innerHTML = '';
        if (wfe.coords.stepsprogress) {
            if ('stepscircle' in wfe.coords)
                draw.stepsprogress.circle();
            if ('stepsLinear' in wfe.coords)
                draw.stepsprogress.linear();
            if ('stepsGoal' in wfe.coords && (wfe.data.steps >= wfe.data.stepsGoal))
                draw.stepsprogress.goal();
        }
    },
    distance_change: () => {
        if ($("in-distance").value > 99) $("in-distance").value = 99;
        if ($("in-distance").value < 0) $("in-distance").value = 0;
        let dist = $("in-distance").value.split(".");
        wfe.data.distance[0] = Number(dist[0]);
        wfe.data.distance[1] = dist.length > 1 ? dist[1].slice(0, 2) : "00";
        removeByClass("c_act_distance");
        if (wfe.coords.activity)
            if ('actDistance' in wfe.coords)
                draw.activity.distance();
    },
    pulse_change: () => {
        if ($("in-pulse").value > 999) $("in-pulse").value = 999;
        if ($("in-pulse").value < 0) $("in-pulse").value = 0;
        wfe.data.pulse = $("in-pulse").value;
        removeByClass("c_act_pulse");
        if (wfe.coords.activity)
            if ('actPulse' in wfe.coords)
                draw.activity.pulse();
    },
    calories_change: () => {
        if ($("in-calories").value > 9999) $("in-calories").value = 9999;
        if ($("in-calories").value < 0) $("in-calories").value = 0;
        wfe.data.calories = $("in-calories").value;
        removeByClass("c_act_cal");
        if (wfe.coords.activity)
            if ('actCal' in wfe.coords)
                draw.activity.cal();
    },
    stepsGoal_change: () => {
        if ($("in-stepsGoal").value > 99999) $("in-stepsGoal").value = 99999;
        if ($("in-stepsGoal").value < 0) $("in-stepsGoal").value = 0;
        wfe.data.stepsGoal = parseInt($("in-stepsGoal").value);
        removeByClass("c_act_stepsGoal");
        if (wfe.coords.activity)
            if ('statstepsGoal' in wfe.coords)
                draw.activity.stepsGoal();
        removeByClass("c_steps_linear");
        removeByClass("c_steps_goal");
        if (wfe.coords.stepsprogress) {
            if ('stepscircle' in wfe.coords)
                draw.stepsprogress.circle();
            if ('stepsLinear' in wfe.coords)
                draw.stepsprogress.linear();
            if ('stepsGoal' in wfe.coords && (wfe.data.steps >= wfe.data.stepsGoal))
                draw.stepsprogress.goal();
        }
    },
    weatherd_change: () => {
        if ($("in-weatherd").value > 199) $("in-weatherd").value = 199;
        if ($("in-weatherd").value < -99) $("in-weatherd").value = -99;
        wfe.data.temp[0] = $("in-weatherd").value;
        removeByClass("c_temp_sep_day");
        removeByClass("c_temp_cur");
        removeByClass("c_temp_oneline");
        if (wfe.coords.weather) {
            if ('weatherOneLine' in wfe.coords)
                draw.weather.temp.oneline();
            if ('weatherDay' in wfe.coords)
                draw.weather.temp.sep.day();
            if ('weatherCurrent' in wfe.coords)
                draw.weather.temp.current();
        }
    },
    weathern_change: () => {
        if ($("in-weathern").value > 199) $("in-weathern").value = 199;
        if ($("in-weathern").value < -99) $("in-weathern").value = -99;
        wfe.data.temp[1] = $("in-weathern").value;
        removeByClass("c_temp_sep_night");
        removeByClass("c_temp_oneline");
        if (wfe.coords.weather) {
            if ('weatherOneLine' in wfe.coords)
                draw.weather.temp.oneline();
            if ('weatherNight' in wfe.coords)
                draw.weather.temp.sep.night();
        }
    },
    air_change: () => {
        if ($("in-air").value > 500) $("in-air").value = 500;
        if ($("in-air").value < 0) $("in-air").value = 0;
        wfe.data.air = $("in-air").value;
        removeByClass("c_air_text");
        if (wfe.coords.weather)
            if ('weatherAirText' in wfe.coords)
                draw.weather.airText();
    },
    weathericon_change: () => {
        if ($("in-weathericon").value > 26) $("in-weathericon").value = 26;
        if ($("in-weathericon").value < 1) $("in-weathericon").value = 1;
        wfe.data.weathericon = $("in-weathericon").value - 1;
        removeByClass("c_weather_icon");
        if (wfe.coords.weather)
            if (wfe.coords.weathericon)
                draw.weather.icon();
    }
};

function makepng() {
    let el = 'watchfaceblock';
    if ($('makepngwithwatch').checked)
        el = 'watchfaceimage';
    html2canvas($(el), {
        onrendered: function(canvas) {
            // let ctx = canvas.getContext('2d');
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
        }
    });
}

function makePreview() {
    html2canvas($('watchfaceimage'), {
        onrendered: function(canvas) {
            $('realsizePreview').innerHTML = '';
            $('realsizePreview').appendChild(canvas);
        }
    });
}

$('realsizePreview').addEventListener('click', makePreview);
$('makepng').addEventListener('click', makepng);
let elements = ['time', 'date', 'battery', 'calories', 'steps', 'stepsGoal', 'pulse', 'distance', 'weatherd', 'weathern', 'weathericon', 'sec', 'alarm', 'bt', 'dnd', 'lock', 'weatherAlt', 'air'];
for (let i in elements) {
    $('in-' + elements[i]).addEventListener('change', changes[elements[i] + '_change']);
}

wfe.makeWf = makeWf;
wfe.view = {
    setPosN: setPosN
};
wfe.draw = draw;