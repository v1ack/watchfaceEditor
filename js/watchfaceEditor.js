function init() {
    function addScript(url) {
        var e = document.createElement("script");
        e.src = url;
        e.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
    if (!('lang' in localStorage))
        localStorage.lang = navigator.language || navigator.userLanguage;
    if (localStorage.lang.indexOf("ru") >= 0) {
        //addScript("assets/russian.json");
        data.app.lang = JSON.parse(russian);
        changeLang();
    }
    if (localStorage.showdemo != 0) {
        window.onload = function () {
            coords = JSON.parse('{"bg":{"Image":{"ImageIndex":265,"X":0,"Y":0}},"time":{"Hours":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":87,"Y":26},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":37,"Y":26}},"Minutes":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":112,"Y":77},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":62,"Y":77}}},"date":false,"battery":false,"status":false,"activity":false,"weather":false,"stepsprogress":false,"analog":false}');
            //setTimeout(view.makeWf, 350);
            view.makeWf();
            load.disableBtn(1);
            UIkit.modal($("modal-loading")).hide();
        }
        if (!('showdemo' in localStorage))
            localStorage.showdemo = 1;
    } else
        $("showdemocheck").checked = false;
    $("showdemocheck").onchange = function () {
        localStorage.showdemo = $("showdemocheck").checked ? 1 : 0;
        location.reload();
    }
    localStorage.biptools = 0;
    for (var i = 200; i <= 292; i++)
        $("defimages").innerHTML += '<img src="defaultimages/' + i + '.png" id="' + i + '">';
    if (!('helpShown' in localStorage)) {
        UIkit.modal($("modal-howto")).show();
        localStorage.helpShown = true;
    }

    data.app.edgeBrowser = navigator.userAgent.search(/Edge/) > 0 || navigator.userAgent.search(/Firefox/) > 0 ? true : false;
    if (data.app.edgeBrowser) {
        UIkit.notification(('browserwarn' in data.app.lang ? data.app.lang.browserwarn : "Something may not work in your browser. WebKit-based browser recommended"), {
            status: 'warning',
            pos: 'top-left',
            timeout: 7500
        });
        addScript("js/FileSaver.min.js");
        addScript("js/canvas-toBlob.js");
    }
    $('inputimages').onchange = function () {
        if (this.files.length) {
            var i = 0;
            console.log("Images count: ", this.files.length);
            while (i < this.files.length) {
                load.renderImage(this.files[i]);
                i++;
            }
            data.imagesset = true;
            if ($('inputimages').nextElementSibling.classList.contains("uk-button-danger"))
                $('inputimages').nextElementSibling.classList.remove("uk-button-danger");
            $('inputimages').nextElementSibling.classList.add("uk-label-success");
        }
        if (data.imagesset && data.jsset)
            load.disableBtn(1);
        else
            load.disableBtn(0);
    }
    $('inputjs').onchange = function () {
        if (this.files.length) {
            data.wfname = this.files[0].name.split(".")[0];
            console.log("Watchface name: ", data.wfname);
            document.title = "Watchface edit " + data.wfname;
            var reader = new FileReader();
            reader.onload = function (e) {
                try {
                    data.import(jsonlint.parse(e.target.result));
                } catch (error) {
                    $("jsonerrortext").innerHTML = error;

                    function show() {
                        UIkit.modal($("jsonerrormodal")).show()
                    }
                    setTimeout(show, 200);
                    console.warn(error);
                }
            }
            reader.readAsText(this.files[0]);
            delete reader;
            data.jsset = true;
            if ($('inputjs').nextElementSibling.classList.contains("uk-button-danger"))
                $('inputjs').nextElementSibling.classList.remove("uk-button-danger");
            $('inputjs').nextElementSibling.classList.add("uk-label-success");
        }
        if (data.imagesset && data.jsset)
            load.disableBtn(1);
        else
            load.disableBtn(0);
    }

    if (!('imagestabversion' in localStorage) || localStorage.imagestabversion < data.app.imagestabversion)
        $("imagesbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
    if (!('editortabversion' in localStorage) || localStorage.editortabversion < data.app.editortabversion)
        $("codeopenbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
    if (!('designtabversion' in localStorage) || localStorage.designtabversion < data.app.designtabversion)
        $("editbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';

    UIkit.modal("#donateframe")._events[0] = function () {
        $("donateframe").innerHTML = '<iframe src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=Watchface%20editor&targets-hint=&default-sum=100&button-text=14&payment-type-choice=on&comment=on&hint=&successURL=&quickpay=shop&account=41001928688597" width="450" height="278" frameborder="0" allowtransparency="true" scrolling="no"></iframe>';
        $("donateframe").classList.remove('uk-modal');
    };
    if (!('showcount' in localStorage)) {
        localStorage.showcount = 1;
    } else {
        localStorage.showcount++;
        if (localStorage.showcount == 10) {
            function show() {
                UIkit.modal($("modal-donate")).show()
            }
            setTimeout(show, 250);
        }
    }
    if (localStorage.showdemo == 0)
        window.onload = function () {
            UIkit.modal($("modal-loading")).hide();
        }
}

function changeLang() {
    var strings = document.querySelectorAll('[data-translate-id]');
    for (var i = 0; i < strings.length; i++) {
        //console.log(strings[i].dataset.translateId);
        if (strings[i].dataset.translateId in data.app.lang)
            strings[i].innerHTML = data.app.lang[strings[i].dataset.translateId];
    }
}

function $(el) {
    return document.getElementById(el);
}

function $c(el) {
    if ($(el) == null)
        throw {
            name: "ImageError",
            imageIndex: el
        }
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

var coords = {},
    data = {
        import: function (json) {
            if ('Background' in json)
                coords.bg = json.Background;
            if ('Time' in json) {
                coords.time = json.Time;
                if ('Seconds' in json.Time) {
                    coords.seconds = json.Time.Seconds;
                    delete coords.time.Seconds;
                }
                if ('AmPm' in json.Time) {
                    coords.ampm = json.Time.AmPm;
                    delete coords.time.AmPm;
                }
            }
            if ('Date' in json) {
                coords.date = true;
                if ('WeekDay' in json.Date)
                    coords.weekday = json.Date.WeekDay;
                if ('MonthAndDay' in json.Date) {
                    coords.monthandday = json.Date.MonthAndDay;
                    if ('Separate' in json.Date.MonthAndDay) {
                        if ('Day' in json.Date.MonthAndDay.Separate)
                            coords.dateday = json.Date.MonthAndDay.Separate.Day;
                        if ('Month' in json.Date.MonthAndDay.Separate)
                            coords.datemonth = json.Date.MonthAndDay.Separate.Month;
                        delete coords.monthandday.Separate;
                    }
                    if ('OneLine' in json.Date.MonthAndDay) {
                        coords.dateoneline = json.Date.MonthAndDay.OneLine;
                        delete coords.monthandday.OneLine;
                    }
                }
            } else
                coords.date = false;
            if ('Battery' in json) {
                coords.battery = true;
                if ('Icon' in json.Battery)
                    coords.batteryicon = json.Battery.Icon;
                if ('Text' in json.Battery)
                    coords.batterytext = json.Battery.Text;
                if ('Scale' in json.Battery)
                    coords.batteryscale = json.Battery.Scale;
            } else
                coords.battery = false;
            if ('Status' in json) {
                coords.status = true;
                if ('Alarm' in json.Status)
                    coords.statalarm = json.Status.Alarm;
                if ('Bluetooth' in json.Status)
                    coords.statbt = json.Status.Bluetooth;
                if ('DoNotDisturb' in json.Status)
                    coords.statdnd = json.Status.DoNotDisturb;
                if ('Lock' in json.Status)
                    coords.statlock = json.Status.Lock;
            } else
                coords.status = false;
            if ('Activity' in json) {
                coords.activity = true;
                if ('Calories' in json.Activity)
                    coords.actcal = json.Activity.Calories;
                if ('Steps' in json.Activity)
                    coords.actsteps = json.Activity.Steps;
                if ('StepsGoal' in json.Activity)
                    coords.actstepsgoal = json.Activity.StepsGoal;
                if ('Pulse' in json.Activity)
                    coords.actpulse = json.Activity.Pulse;
                if ('Distance' in json.Activity)
                    coords.actdist = json.Activity.Distance;
            } else
                coords.activity = false;
            if ('Weather' in json) {
                coords.weather = true;
                if ('Icon' in json.Weather)
                    coords.weathericon = json.Weather.Icon;
                if ('Temperature' in json.Weather) {
                    if ('Today' in json.Weather.Temperature) {
                        if ('OneLine' in json.Weather.Temperature.Today)
                            coords.weatheroneline = json.Weather.Temperature.Today.OneLine;
                        if ('Separate' in json.Weather.Temperature.Today) {
                            if ('Day' in json.Weather.Temperature.Today.Separate)
                                coords.weatherday = json.Weather.Temperature.Today.Separate.Day;
                            if ('Night' in json.Weather.Temperature.Today.Separate)
                                coords.weathernight = json.Weather.Temperature.Today.Separate.Night;
                        }
                    }
                    if ('Current' in json.Weather.Temperature)
                        coords.weathercur = json.Weather.Temperature.Current;
                }
                if ('AirPollution' in json.Weather)
                    coords.weatherair = json.Weather.AirPollution;
            } else
                coords.weather = false;
            if ('StepsProgress' in json) {
                coords.stepsprogress = true;
                if ('Circle' in json.StepsProgress)
                    coords.stepscircle = json.StepsProgress.Circle;
                if ('Linear' in json.StepsProgress)
                    coords.stepslinear = json.StepsProgress.Linear;
                if ('GoalImage' in json.StepsProgress)
                    coords.stepsgoal = json.StepsProgress.GoalImage;
            } else
                coords.stepsprogress = false;
            if ('AnalogDialFace' in json) {
                coords.analog = true;
                if ('Hours' in json.AnalogDialFace)
                    coords.analoghours = json.AnalogDialFace.Hours;
                if ('Minutes' in json.AnalogDialFace)
                    coords.analogminutes = json.AnalogDialFace.Minutes;
                if ('Seconds' in json.AnalogDialFace)
                    coords.analogseconds = json.AnalogDialFace.Seconds;
            } else
                coords.analog = false;
        },
        export: function () {
            var packed = {};
            if ('bg' in coords)
                packed.Background = coords.bg;
            if ('time' in coords) {
                packed.Time = JSON.parse(JSON.stringify(coords.time));
                if ('seconds' in coords)
                    packed.Time.Seconds = coords.seconds;
                if ('ampm' in coords)
                    packed.Time.AmPm = coords.ampm;
            }
            if (coords.date) {
                packed.Date = {};
                if ('weekday' in coords)
                    packed.Date.WeekDay = coords.weekday;
                if ('monthandday' in coords) {
                    packed.Date.MonthAndDay = coords.monthandday;
                    if ('dateday' in coords || 'datemonth' in coords) {
                        packed.Date.MonthAndDay.Separate = {};
                        if ('dateday' in coords)
                            packed.Date.MonthAndDay.Separate.Day = coords.dateday;
                        if ('datemonth' in coords)
                            packed.Date.MonthAndDay.Separate.Month = coords.datemonth;
                    }
                    if ('dateoneline' in coords)
                        packed.Date.MonthAndDay.OneLine = coords.dateoneline;
                }
            }
            if (coords.status) {
                packed.Status = {};
                if ('statalarm' in coords)
                    packed.Status.Alarm = coords.statalarm;
                if ('statbt' in coords)
                    packed.Status.Bluetooth = coords.statbt;
                if ('statdnd' in coords)
                    packed.Status.DoNotDisturb = coords.statdnd;
                if ('statlock' in coords)
                    packed.Status.Lock = coords.statlock;
            }
            if (coords.battery) {
                packed.Battery = {};
                if ('batteryicon' in coords)
                    packed.Battery.Icon = coords.batteryicon;
                if ('batterytext' in coords)
                    packed.Battery.Text = coords.batterytext;
                if ('batteryscale' in coords)
                    packed.Battery.Scale = coords.batteryscale;
            }
            if (coords.activity) {
                packed.Activity = {};
                if ('actcal' in coords)
                    packed.Activity.Calories = coords.actcal;
                if ('actsteps' in coords)
                    packed.Activity.Steps = coords.actsteps;
                if ('actstepsgoal' in coords)
                    packed.Activity.StepsGoal = coords.actstepsgoal;
                if ('actpulse' in coords)
                    packed.Activity.Pulse = coords.actpulse;
                if ('actdist' in coords)
                    packed.Activity.Distance = coords.actdist;
            }
            if (coords.weather) {
                packed.Weather = {};
                if ('weathericon' in coords)
                    packed.Weather.Icon = coords.weathericon;
                if ('weathercur' in coords || 'weatherday' in coords || 'weathernight' in coords || 'weatheroneline' in coords) {
                    packed.Weather.Temperature = {};
                    if ('weatherday' in coords || 'weathernight' in coords || 'weatheroneline' in coords) {
                        packed.Weather.Temperature.Today = {};
                        if ('weatheroneline' in coords)
                            packed.Weather.Temperature.Today.OneLine = coords.weatheroneline;
                        if ('weatherday' in coords || 'weathernight' in coords) {
                            packed.Weather.Temperature.Today.Separate = {};
                            if ('weatherday' in coords)
                                packed.Weather.Temperature.Today.Separate.Day = coords.weatherday;
                            if ('weathernight' in coords)
                                packed.Weather.Temperature.Today.Separate.Night = coords.weathernight;
                        }
                    }
                    if ('weathercur' in coords)
                        packed.Weather.Temperature.Current = coords.weathercur;
                }
                if ('weatherair' in coords)
                    packed.Weather.AirPollution = coords.weatherair;
            }
            if (coords.stepsprogress) {
                packed.StepsProgress = {};
                if ('stepscircle' in coords)
                    packed.StepsProgress.Circle = coords.stepscircle;
                if ('stepslinear' in coords)
                    packed.StepsProgress.Linear = coords.stepslinear;
                if ('stepsgoal' in coords)
                    packed.StepsProgress.GoalImage = coords.stepsgoal;
            }
            if (coords.analog) {
                packed.AnalogDialFace = {};
                if ('analoghours' in coords)
                    packed.AnalogDialFace.Hours = coords.analoghours;
                if ('analogminutes' in coords)
                    packed.AnalogDialFace.Minutes = coords.analogminutes;
                if ('analogseconds' in coords)
                    packed.AnalogDialFace.Seconds = coords.analogseconds;
            }
            return packed;
        },
        app: {
            imagestabversion: 2,
            editortabversion: 1,
            designtabversion: 1,
            edgeBrowser: undefined,
            lang: {},
            local: (location.protocol != "file:" ? false : true),
            firstopen_editor: ('firstopen_editor' in sessionStorage ? false : true)
        },
        timeOnClock: ["20", "38"],
        seconds: [4, 3],
        analog: [259, 228, 60],
        weekDay: 2,
        day: 6,
        month: 12,
        batteryT: 20,
        calories: 860,
        steps: 5687,
        stepsgoal: 12000,
        distance: [5, 67],
        pulse: 72,
        temp: [22, 24],
        weathericon: 0,
        alarm: true,
        bluetooth: true,
        dnd: true,
        lock: true,
        jsset: false,
        imagesset: false,
        wfname: "watchface"
    },
    view = {
        drawAnalog: function (el, value) {
            var col = el.Color.replace("0x", "#"),
                d = "M " + el.Shape[0].X + " " + el.Shape[0].Y,
                iters = el.Shape.length,
                fill = el.OnlyBorder ? "none" : col;
            for (var i = 0; i < iters; i++) {
                d += "L " + el.Shape[i].X + " " + el.Shape[i].Y + " ";
            }
            d += "L " + el.Shape[0].X + " " + el.Shape[0].Y + " ";
            $('svg-cont-clock').innerHTML += '<path d="' + d + '" transform="rotate(' + (value - 90) + ' ' + el.Center.X + ' ' + el.Center.Y + ') translate(' + el.Center.X + " " + el.Center.Y + ') " fill="' + fill + '" stroke="' + col + '"></path>';
            if ('CenterImage' in el) {
                view.setPosN(el.CenterImage, 0, "c_an_img");
            }
        },
        setTextPos: function (el, value, cls) {
            var t = view.makeBlock(el, value);
            view.renderBlock(t.block, t.width, el, cls);
        },
        insert: function (t, name) {
            t.removeAttribute('id');
            t.classList.add(name);
            $("watchface").appendChild(t);
        },
        setPosN: function (el, value, cls) {
            t = $c(el.ImageIndex + value);
            t.style.left = el.X + "px";
            t.style.top = el.Y + "px";
            view.insert(t, cls);
        },
        setPos: function (t, el) {
            t.style.left = el.X + "px";
            t.style.top = el.Y + "px";
        },
        makeWf: function () {
            try {
                $("watchface").innerHTML = '';
                $("svg-cont-clock").innerHTML = '';
                $("svg-cont-steps").innerHTML = '';
                UIkit.notification.closeAll()
                var t = 0;
                if ('bg' in coords)
                    view.setPosN(coords.bg.Image, 0, "c_bg");
                if ('time' in coords)
                    draw.time.time();
                if ('seconds' in coords)
                    draw.time.seconds();
                if (coords.date) {
                    if ('weekday' in coords)
                        draw.date.weekday();
                    if ('dateday' in coords)
                        draw.date.sepday();
                    if ('datemonth' in coords)
                        draw.date.sepmonth();
                    if ('dateoneline' in coords)
                        draw.date.oneline();
                }
                if (coords.battery) {
                    if ('batteryicon' in coords)
                        draw.battery.icon();
                    if ('batterytext' in coords)
                        draw.battery.text();
                    if ('batteryscale' in coords)
                        draw.battery.scale();
                }
                if (coords.status) {
                    if ('statalarm' in coords)
                        draw.status.alarm();
                    if ('statbt' in coords)
                        draw.status.bt();
                    if ('statdnd' in coords)
                        draw.status.dnd();
                    if ('statlock' in coords)
                        draw.status.lock();
                }
                if (coords.activity) {
                    if ('actcal' in coords)
                        draw.activity.cal();
                    if ('actsteps' in coords)
                        draw.activity.steps();
                    if ('actstepsgoal' in coords)
                        draw.activity.stepsgoal();
                    if ('actpulse' in coords)
                        draw.activity.pulse();
                    if ('actdist' in coords)
                        draw.activity.distance();
                }
                if (coords.weather) {
                    if ('weathericon' in coords)
                        draw.weather.icon();
                    if ('weatheroneline' in coords)
                        draw.weather.temp.oneline();
                    if ('weatherday' in coords)
                        draw.weather.temp.sep.day();
                    if ('weathernight' in coords)
                        draw.weather.temp.sep.night();
                    if ('weathercur' in coords)
                        draw.weather.temp.current();
                    if ('weatherair' in coords)
                        draw.weather.air();
                }
                if (coords.stepsprogress) {
                    if ('stepscircle' in coords)
                        draw.stepsprogress.circle();
                    if ('stepslinear' in coords)
                        draw.stepsprogress.linear();
                    if ('stepsgoal' in coords && data.steps >= data.stepsgoal)
                        draw.stepsprogress.goal();
                }
                if (coords.analog) {
                    if ('analoghours' in coords)
                        draw.analog.hours();
                    if ('analogminutes' in coords)
                        draw.analog.minutes();
                    if ('analogseconds' in coords)
                        draw.analog.seconds();
                }
            } catch (error) {
                console.warn(error);
                if (error.name == "ImageError") {
                    UIkit.notification(('imagenotfound' in data.app.lang ? data.app.lang.imagenotfound : "Image with index $index not found").replace("$index", "<b>" + error.imageIndex + "</b>"), {
                        status: 'danger',
                        pos: 'top-left',
                        timeout: 7500
                    });
                }
                if (error.name == "TypeError") {
                    UIkit.notification("Image for prorety not found", {
                        status: 'danger',
                        pos: 'top-left',
                        timeout: 7500
                    });
                }
            }
        },
        renderBlock: function (block, width, el, cls) {
            var t, offset = 0;
            if (el.Alignment == 18 || el.Alignment == "TopLeft") {
                block.reverse();
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.TopLeftX + offset + "px";
                    t.style.top = el.TopLeftY + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else if (el.Alignment == 20 || el.Alignment == "TopRight") {
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                    t.style.top = el.TopLeftY + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else if (el.Alignment == 34 || el.Alignment == "BottomLeft") {
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                    t.style.top = el.BottomRightY - t.height + 1 + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else if (el.Alignment == 24 || el.Alignment == "TopCenter") {
                block.reverse();
                offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
                //console.log(offset);
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.TopLeftX + offset + "px";
                    t.style.top = el.TopLeftY + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else if (el.Alignment == 72 || el.Alignment == "Center") {
                block.reverse();
                offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
                //console.log(offset, width, el.BottomRightX, el.TopLeftX, el);
                var topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
                //console.log(topoffset, block[0].height, el.BottomRightY, el.TopLeftY);
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.TopLeftX + offset + "px";
                    t.style.top = el.TopLeftY + topoffset + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else {
                UIkit.notification("Site author is too lazy to do this <b>(" + el.Alignment + ")</b> type of alignment... But you can send him your watchface and he will do it for you", {
                    status: 'warning',
                    pos: 'top-left',
                    timeout: 7500
                });
            }
        },
        makeBlock: function (el, value) {
            value = value.toString();
            var block = Array(),
                width = 0,
                t;
            while (value != "") {
                t = $c(el.ImageIndex + Number(value[0]));
                block.push(t);
                width += t.width + el.Spacing;
                value = value.substr(1);
            }
            width = width - el.Spacing;
            return {
                block,
                width
            }
        },
        time_change: function () {
            var t = $("in-time").value.split(":");
            data.timeOnClock[0] = t[0];
            data.timeOnClock[1] = t[1];
            data.analog[0] = (t[0] > 12 ? t[0] - 12 : t[0]) * 30 + t[1] * 0.5;
            data.analog[1] = t[1] * 6;
            $("svg-cont-clock").innerHTML = '';
            if ('analog' in coords) {
                if ('analoghours' in coords)
                    draw.analog.hours();
                if ('analogminutes' in coords)
                    draw.analog.minutes();
                if ('analogseconds' in coords)
                    draw.analog.seconds();
            }
            removeByClass("c_time");
            if ('time' in coords)
                draw.time.time();
        },
        date_change: function () {
            var t = $("in-date").valueAsDate;
            try {
                data.day = t.getDate();
                data.month = t.getMonth() + 1;
                data.weekDay = t.getDay() > 0 ? t.getDay() - 1 : 6;
                removeByClass("c_date_sepday");
                removeByClass("c_date_weekday");
                removeByClass("c_date_sepmonth");
                removeByClass("c_date_oneline");
                if (coords.date) {
                    if ('weekday' in coords)
                        draw.date.weekday();
                    if ('datesepday' in coords)
                        draw.date.sepday();
                    if ('datesepmonth' in coords)
                        draw.date.sepmonth();
                    if ('dateoneline' in coords)
                        draw.date.oneline();
                }
            } catch (e) {}
        },
        sec_change: function () {
            if ($("in-sec").value > 59) $("in-sec").value = 59;
            if ($("in-sec").value < 0) $("in-sec").value = 0;
            var sec = $("in-sec").value;
            data.seconds[0] = Number(sec.split("")[0]);
            data.seconds[1] = Number((sec.split("").length == 1 ? 0 : sec.split("")[1]));
            data.analog[2] = sec * 6;
            $("svg-cont-clock").innerHTML = '';
            if ('analog' in coords) {
                if ('analoghours' in coords)
                    draw.analog.hours();
                if ('analogminutes' in coords)
                    draw.analog.minutes();
                if ('analogseconds' in coords)
                    draw.analog.seconds();
            }
            removeByClass("c_sec");
            if ('time' in coords)
                if ('seconds' in coords)
                    draw.time.seconds();
        },
        battery_change: function () {
            if ($("in-battery").value > 100) $("in-battery").value = 100;
            if ($("in-battery").value < 0) $("in-battery").value = 0;
            data.batteryT = $("in-battery").value;
            removeByClass("c_battery_icon");
            removeByClass("c_battery_scale");
            removeByClass("c_battery_text");
            if (coords.battery) {
                if ('batteryicon' in coords)
                    draw.battery.icon();
                if ('batterytext' in coords)
                    draw.battery.text();
                if ('batteryscale' in coords)
                    draw.battery.scale();
            }
        },
        alarm_change: function () {
            data.alarm = $("in-alarm").checked;
            removeByClass("c_stat_alarm");
            if (coords.status)
                if ('statalarm' in coords)
                    draw.status.alarm();
        },
        bt_change: function () {
            data.bluetooth = $("in-bt").checked;
            removeByClass("c_stat_bt");
            if (coords.status)
                if ('statbt' in coords)
                    draw.status.bt();

        },
        dnd_change: function () {
            data.dnd = $("in-dnd").checked;
            removeByClass("c_stat_dnd");
            if (coords.status)
                if ('statdnd' in coords)
                    draw.status.dnd();
        },
        lock_change: function () {
            data.lock = $("in-lock").checked;
            removeByClass("c_stat_lock");
            if (coords.status)
                if ('statlock' in coords)
                    draw.status.lock();
        },
        steps_change: function () {
            if ($("in-steps").value > 99999) $("in-steps").value = 99999;
            if ($("in-steps").value < 0) $("in-steps").value = 0;
            data.steps = $("in-steps").value;
            removeByClass("c_act_steps");
            if (coords.activity)
                if ('actsteps' in coords)
                    draw.activity.steps();
            removeByClass("c_steps_linear");
            removeByClass("c_steps_goal");
            $("svg-cont-steps").innerHTML = '';
            if (coords.stepsprogress) {
                if ('stepscircle' in coords)
                    draw.stepsprogress.circle();
                if ('stepslinear' in coords)
                    draw.stepsprogress.linear();
                if ('stepsgoal' in coords && data.steps >= data.stepsgoal)
                    draw.stepsprogress.goal();
            }
        },
        distance_change: function () {
            if ($("in-distance").value > 99) $("in-distance").value = 99;
            if ($("in-distance").value < 0) $("in-distance").value = 0;
            var dist = $("in-distance").value.split(".");
            data.distance[0] = Number(dist[0]);
            data.distance[1] = dist.length > 1 ? dist[1].slice(0, 2) : "00";
            removeByClass("c_act_distance");
            if (coords.activity)
                if ('actdist' in coords)
                    draw.activity.distance();
        },
        pulse_change: function () {
            if ($("in-pulse").value > 999) $("in-pulse").value = 999;
            if ($("in-pulse").value < 0) $("in-pulse").value = 0;
            data.pulse = $("in-pulse").value;
            removeByClass("c_act_pulse");
            if (coords.activity)
                if ('actpulse' in coords)
                    draw.activity.pulse();
        },
        calories_change: function () {
            if ($("in-calories").value > 9999) $("in-calories").value = 9999;
            if ($("in-calories").value < 0) $("in-calories").value = 0;
            data.calories = $("in-calories").value;
            removeByClass("c_act_cal");
            if (coords.activity)
                if ('actcal' in coords)
                    draw.activity.cal();
        },
        stepsgoal_change: function () {
            if ($("in-stepsgoal").value > 99999) $("in-stepsgoal").value = 99999;
            if ($("in-stepsgoal").value < 0) $("in-stepsgoal").value = 0;
            data.stepsgoal = $("in-stepsgoal").value;
            removeByClass("c_act_stepsgoal");
            if (coords.activity)
                if ('statstepsgoal' in coords)
                    draw.activity.stepsgoal();
            removeByClass("c_steps_linear");
            removeByClass("c_steps_goal");
            if (coords.stepsprogress) {
                if ('stepscircle' in coords)
                    draw.stepsprogress.circle();
                if ('stepslinear' in coords)
                    draw.stepsprogress.linear();
                if ('stepsgoal' in coords)
                    draw.stepsprogress.goal();
            }
        },
        weatherd_change: function () {
            if ($("in-weatherd").value > 99) $("in-weatherd").value = 99;
            if ($("in-weatherd").value < -99) $("in-weatherd").value = -99;
            data.temp[0] = $("in-weatherd").value;
            removeByClass("c_temp_sep_day");
            removeByClass("c_temp_cur");
            removeByClass("c_temp_oneline");
            if (coords.weather) {
                if ('weatheroneline' in coords)
                    draw.weather.temp.oneline();
                if ('weatherday' in coords)
                    draw.weather.temp.sep.day();
                if ('weathercur' in coords)
                    draw.weather.temp.current();
            }
        },
        weathern_change: function () {
            if ($("in-weathern").value > 99) $("in-weathern").value = 99;
            if ($("in-weathern").value < -99) $("in-weathern").value = -99;
            data.temp[1] = $("in-weathern").value;
            removeByClass("c_temp_sep_night");
            removeByClass("c_temp_oneline");
            if (coords.weather) {
                if ('weatheroneline' in coords)
                    draw.weather.temp.oneline();
                if ('weathernight' in coords)
                    draw.weather.temp.sep.night();
            }
        },
        weathericon_change: function () {
            if ($("in-weatheri").value > 26) $("in-weatheri").value = 26;
            if ($("in-weatheri").value < 1) $("in-weatheri").value = 1;
            data.weathericon = $("in-weatheri").value - 1;
            removeByClass("c_weather_icon");
            if (coords.weather)
                if (coords.weathericon)
                    draw.weather.icon();
        }
    },
    load = {
        allinone: function () {
            data.import(JSON.parse('{"Background":{"Image":{"ImageIndex":265,"X":0,"Y":0}},"Time":{"DrawingOrder":"1234","Hours":{"Ones":{"ImageIndex":200,"ImagesCount":10,"X":9,"Y":0},"Tens":{"ImageIndex":200,"ImagesCount":10,"X":0,"Y":0}},"Minutes":{"Ones":{"ImageIndex":200,"ImagesCount":10,"X":29,"Y":0},"Tens":{"ImageIndex":200,"ImagesCount":10,"X":20,"Y":0}},"AmPm":{"X":41,"Y":11,"ImageIndexAm":233,"ImageIndexPm":234},"Seconds":{"Tens":{"X":41,"Y":0,"ImageIndex":200,"ImagesCount":10},"Ones":{"X":51,"Y":0,"ImageIndex":200,"ImagesCount":10}}},"Date":{"WeekDay":{"X":0,"Y":24,"ImageIndex":210,"ImagesCount":7},"MonthAndDay":{"Separate":{"Day":{"TopLeftX":0,"TopLeftY":11,"BottomRightX":15,"BottomRightY":20,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Month":{"TopLeftX":20,"TopLeftY":11,"BottomRightX":35,"BottomRightY":20,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10}},"TwoDigitsMonth":true,"TwoDigitsDay":true}},"Activity":{"Steps":{"TopLeftX":40,"TopLeftY":111,"BottomRightX":82,"BottomRightY":120,"Alignment":"TopRight","Spacing":2,"ImageIndex":200,"ImagesCount":10},"StepsGoal":{"TopLeftX":94,"TopLeftY":111,"BottomRightX":136,"BottomRightY":120,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Pulse":{"TopLeftX":43,"TopLeftY":148,"BottomRightX":67,"BottomRightY":157,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Calories":{"TopLeftX":2,"TopLeftY":148,"BottomRightX":35,"BottomRightY":157,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Distance":{"Number":{"TopLeftX":0,"TopLeftY":162,"BottomRightX":58,"BottomRightY":171,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"SuffixImageIndex":231,"DecimalPointImageIndex":232}},"StepsProgress":{"Linear":{"StartImageIndex":200,"Segments":[{"X":40,"Y":121},{"X":55,"Y":121},{"X":67,"Y":121},{"X":79,"Y":121},{"X":91,"Y":121},{"X":104,"Y":121},{"X":117,"Y":121},{"X":130,"Y":121}]},"Circle":{"CenterX":88,"CenterY":88,"RadiusX":24,"RadiusY":24,"StartAngle":0,"EndAngle":360,"Width":3,"Color":"0x00FF00"},"GoalImage":{"X":83,"Y":111,"ImageIndex":266}},"Status":{"Alarm":{"Coordinates":{"X":140,"Y":0},"ImageIndexOn":224},"Bluetooth":{"Coordinates":{"X":164,"Y":13},"ImageIndexOn":220,"ImageIndexOff":221},"Lock":{"Coordinates":{"X":166,"Y":0},"ImageIndexOn":223},"DoNotDisturb":{"Coordinates":{"X":153,"Y":0},"ImageIndexOn":222}},"Battery":{"Icon":{"X":116,"Y":0,"ImageIndex":225,"ImagesCount":6},"Text":{"TopLeftX":3,"TopLeftY":133,"BottomRightX":27,"BottomRightY":142,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Scale":{"StartImageIndex":200,"Segments":[{"X":90,"Y":64},{"X":104,"Y":73},{"X":100,"Y":93},{"X":80,"Y":106},{"X":65,"Y":95},{"X":63,"Y":76},{"X":69,"Y":64}]}},"Weather":{"Icon":{"CustomIcon":{"X":146,"Y":146,"ImageIndex":267,"ImagesCount":26}},"AirPollution":{"Icon":{"X":79,"Y":136,"ImageIndex":235,"ImagesCount":6}},"Temperature":{"Current":{"Number":{"TopLeftX":142,"TopLeftY":136,"BottomRightX":175,"BottomRightY":145,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218},"Today":{"Separate":{"Day":{"Number":{"TopLeftX":93,"TopLeftY":166,"BottomRightX":114,"BottomRightY":175,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218},"Night":{"Number":{"TopLeftX":93,"TopLeftY":153,"BottomRightX":114,"BottomRightY":162,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218}}}}},"AnalogDialFace":{"Hours":{"OnlyBorder":false,"Color":"0xFFFFFF","Center":{"X":88,"Y":88},"Shape":[{"X":-17,"Y":-2},{"X":54,"Y":-2},{"X":54,"Y":1},{"X":-17,"Y":1}]},"Minutes":{"OnlyBorder":false,"Color":"0xFFFFFF","Center":{"X":88,"Y":88},"Shape":[{"X":-17,"Y":-2},{"X":68,"Y":-2},{"X":68,"Y":1},{"X":-17,"Y":1}]},"Seconds":{"OnlyBorder":false,"Color":"0xFF0000","Center":{"X":88,"Y":88},"Shape":[{"X":-21,"Y":-1},{"X":82,"Y":-1},{"X":82,"Y":0},{"X":-21,"Y":0}],"CenterImage":{"X":84,"Y":84,"ImageIndex":200}}}}'));
            view.makeWf();
        },
        disableBtn: function (i) {
            if (i) {
                $("editbutton").classList.remove("uk-disabled");
                $("makepng").removeAttribute("disabled");
                $("viewsettings").removeAttribute("disabled");
                $("codeopenbutton").classList.remove("uk-disabled");
                $("imagesbutton").classList.remove("uk-disabled");
                setTimeout(view.makeWf, 300);
            } else {
                $("editbutton").classList.add("uk-disabled");
                $("makepng").setAttribute("disabled", "");
                $("viewsettings").setAttribute("disabled", "");
                $("codeopenbutton").classList.add("uk-disabled");
                $("imagesbutton").classList.add("uk-disabled");
            }
        },
        clearjs: function () {
            $('inputjs').value = '';
            coords = {};
            data.jsset = false;
            if ($('inputjs').nextElementSibling.classList.contains("uk-label-success"))
                $('inputjs').nextElementSibling.classList.remove("uk-label-success");
            $('inputjs').nextElementSibling.classList.add("uk-button-danger");
            load.disableBtn(0);
        },
        clearimg: function () {
            $('inputimages').value = '';
            $('allimages').innerHTML = '';
            data.imagesset = false;
            if ($('inputimages').nextElementSibling.classList.contains("uk-label-success")) $('inputimages').nextElementSibling.classList.remove("uk-label-success");
            $('inputimages').nextElementSibling.classList.add("uk-button-danger");
            load.disableBtn(0);
        },
        renderImage: function (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                the_url = event.target.result;
                if (!(isNaN(Number(file.name.replace('.png', ''))))) {
                    $('allimages').innerHTML += "<img src=\"" + the_url + "\" id=\"" + Number(file.name.replace('.png', '')) + "\" >";
                } else if (file.name == "weather.png") {
                    $('weather').parentNode.removeChild($('weather'));
                    $('allimages').innerHTML += "<img src=\"" + the_url + "\" id=\"" + file.name.replace('.png', '') + "\" >";
                }
            }
            reader.readAsDataURL(file);
            delete reader;
        }
    },
    draw = {
        time: {
            time: function () {
                var ntimeOnClock = data.timeOnClock[0];
                if ('ampm' in coords) {
                    var am = 1;
                    if (Number(ntimeOnClock) > 12) {
                        ntimeOnClock = (Number(ntimeOnClock) - 12).toString();
                        if (ntimeOnClock.length == 1)
                            ntimeOnClock = "0" + ntimeOnClock;
                        am = 0;
                    }
                    t = am ? $c(coords.ampm.ImageIndexAm) : $c(coords.ampm.ImageIndexPm);
                    view.setPos(t, coords.ampm);
                    view.insert(t, "c_time_am");

                }
                view.setPosN(coords.time.Hours.Tens, Number(ntimeOnClock[0]), "c_time");
                view.setPosN(coords.time.Hours.Ones, Number(ntimeOnClock[1]), "c_time");
                view.setPosN(coords.time.Minutes.Tens, Number(data.timeOnClock[1][0]), "c_time");
                view.setPosN(coords.time.Minutes.Ones, Number(data.timeOnClock[1][1]), "c_time");
            },
            seconds: function () {
                view.setPosN(coords.seconds.Tens, data.seconds[0], "c_sec");
                view.setPosN(coords.seconds.Ones, data.seconds[1], "c_sec");
            }
        },
        date: {
            weekday: function () {
                view.setPosN(coords.weekday, data.weekDay, "c_date_weekday");
            },
            sepday: function () {
                var t = view.makeBlock(coords.dateday, data.day);
                if (coords.monthandday.TwoDigitsDay)
                    if (!div(data.day, 10)) {
                        t.block.splice(-1, 0, $c(coords.dateday.ImageIndex));
                        t.width += $(coords.dateday.ImageIndex).width + coords.dateday.Spacing;
                    }
                view.renderBlock(t.block, t.width, coords.dateday, "c_date_sepday");
            },
            sepmonth: function () {
                var t = view.makeBlock(coords.datemonth, data.month);
                if (coords.monthandday.TwoDigitsMonth)
                    if (!div(data.month, 10)) {
                        t.block.splice(-1, 0, $c(coords.datemonth.ImageIndex));
                        t.width += $(coords.datemonth.ImageIndex).width + coords.datemonth.Spacing;
                    }
                view.renderBlock(t.block, t.width, coords.datemonth, "c_date_sepmonth");
            },
            oneline: function () {
                var dot = $c(coords.dateoneline.DelimiterImageIndex);
                t = view.makeBlock(coords.dateoneline.Number, data.month);
                if (coords.monthandday.TwoDigitsMonth)
                    if (!div(data.month, 10)) {
                        t.block.splice(-1, 0, $c(coords.dateoneline.Number.ImageIndex));
                        t.width += $(coords.dateoneline.Number.ImageIndex).width + coords.dateoneline.Number.Spacing;
                    }
                t.block.push(dot);
                t.width += dot.width + coords.dateoneline.Number.Spacing;
                var t2 = view.makeBlock(coords.dateoneline.Number, data.day);
                t.block = t.block.concat(t2.block);
                if (coords.monthandday.TwoDigitsDay)
                    if (!div(data.day, 10)) {
                        t.block.splice(-1, 0, $c(coords.dateoneline.Number.ImageIndex));
                        t.width += $(coords.dateoneline.Number.ImageIndex).width + coords.dateoneline.Number.Spacing;
                    }
                t.width += t2.width;
                view.renderBlock(t.block, t.width, coords.dateoneline.Number, "c_date_oneline");
            }

        },
        battery: {
            icon: function () {
                var battery = Math.round(data.batteryT / (100 / (coords.batteryicon.ImagesCount - 1)));
                view.setPosN(coords.batteryicon, battery, "c_battery_icon");
            },
            text: function () {
                view.setTextPos(coords.batterytext, data.batteryT, "c_battery_text");
            },
            scale: function () {
                var end = Math.round(data.batteryT / (100 / (coords.batteryscale.Segments.length - 1)));
                for (var i = 0; i <= end; i++) {
                    t = $c(coords.batteryscale.StartImageIndex + i);
                    view.setPos(t, coords.batteryscale.Segments[i]);
                    view.insert(t, "c_battery_scale");
                }
            }
        },
        analog: {
            hours: function () {
                view.drawAnalog(coords.analoghours, data.analog[0]);
            },
            minutes: function () {
                view.drawAnalog(coords.analogminutes, data.analog[1]);
            },
            seconds: function () {
                view.drawAnalog(coords.analogseconds, data.analog[2]);
            }
        },
        status: {
            alarm: function () {
                if ('ImageIndexOff' in coords.statalarm && !data.alarm)
                    t = $c(coords.statalarm.ImageIndexOff);
                else if (data.alarm)
                    t = $c(coords.statalarm.ImageIndexOn);
                else return;
                t.style.left = coords.statalarm.Coordinates.X + "px";
                t.style.top = coords.statalarm.Coordinates.Y + "px";
                view.insert(t, "c_stat_alarm");
            },
            bt: function () {
                if ('ImageIndexOff' in coords.statbt && !data.bluetooth)
                    t = $c(coords.statbt.ImageIndexOff);
                else if ('ImageIndexOn' in coords.statbt && data.bluetooth)
                    t = $c(coords.statbt.ImageIndexOn);
                else return;
                t.style.left = coords.statbt.Coordinates.X + "px";
                t.style.top = coords.statbt.Coordinates.Y + "px";
                view.insert(t, "c_stat_bt");
            },
            dnd: function () {
                if ('ImageIndexOff' in coords.statdnd && !data.dnd)
                    t = $c(coords.statdnd.ImageIndexOff);
                else if (data.dnd)
                    t = $c(coords.statdnd.ImageIndexOn);
                else return;
                t.style.left = coords.statdnd.Coordinates.X + "px";
                t.style.top = coords.statdnd.Coordinates.Y + "px";
                view.insert(t, "c_stat_dnd");
            },
            lock: function () {
                if ('ImageIndexOff' in coords.statlock && !data.lock)
                    t = $c(coords.statlock.ImageIndexOff);
                else if (data.lock)
                    t = $c(coords.statlock.ImageIndexOn);
                else return;
                t.style.left = coords.statlock.Coordinates.X + "px";
                t.style.top = coords.statlock.Coordinates.Y + "px";
                view.insert(t, "c_stat_lock");
            }
        },
        activity: {
            cal: function () {
                view.setTextPos(coords.actcal, data.calories, "c_act_cal");
            },
            steps: function () {
                view.setTextPos(coords.actsteps, data.steps, "c_act_steps");
            },
            stepsgoal: function () {
                view.setTextPos(coords.actstepsgoal, data.stepsgoal, "c_act_stepsg");
            },
            pulse: function () {
                view.setTextPos(coords.actpulse, data.pulse, "c_act_pulse");
            },
            distance: function () {
                var dot = $c(coords.actdist.DecimalPointImageIndex),
                    km = $c(coords.actdist.SuffixImageIndex);
                t = view.makeBlock(coords.actdist.Number, data.distance[0]);
                t.block.push(dot);
                t.width += dot.width + coords.actdist.Number.Spacing;
                var t2 = view.makeBlock(coords.actdist.Number, data.distance[1]);
                t.block = t.block.concat(t2.block);
                t.width += t2.width;
                t.block.push(km);
                t.width += km.width;
                view.renderBlock(t.block, t.width, coords.actdist.Number, "c_act_distance");
            }
        },
        stepsprogress: {
            circle: function () {
                var col = coords.stepscircle.Color.replace("0x", "#"),
                    full = Math.floor(2 * coords.stepscircle.RadiusX * Math.PI / 360 * (coords.stepscircle.EndAngle - coords.stepscircle.StartAngle));
                var fill = Math.round(data.steps / (data.stepsgoal / full));
                if (fill > full) fill = full;
                $('svg-cont-steps').innerHTML += "<ellipse transform=\"rotate(" + (-90 + coords.stepscircle.StartAngle) + " " + coords.stepscircle.CenterX + " " + coords.stepscircle.CenterY + ")\" cx=\"" + coords.stepscircle.CenterX + "\" cy=\"" + coords.stepscircle.CenterY + "\" rx=\"" + coords.stepscircle.RadiusX + "\" ry=\"" + coords.stepscircle.RadiusY + "\" fill=\"rgba(255,255,255,0)\" stroke-width=\"" + coords.stepscircle.Width + "\" stroke=\"" + col + "\" stroke-dasharray=\"" + fill + " " + (full - fill) + "\" stroke-linecap=\"none\"></ellipse>";
            },
            linear: function () {
                var end = Math.round(data.steps / (data.stepsgoal / (coords.stepslinear.Segments.length))) - 1;
                if (end > coords.stepslinear.Segments.length - 1)
                    end = coords.stepslinear.Segments.length - 1;
                for (var i = 0; i <= end; i++) {
                    t = $c(coords.stepslinear.StartImageIndex + i);
                    view.setPos(t, coords.stepslinear.Segments[i]);
                    view.insert(t, "c_steps_linear");
                }
            },
            goal: function () {
                if (data.steps >= data.stepsgoal)
                    view.setPosN(coords.stepsgoal, 0, "c_steps_goal");
            }
        },
        weather: {
            icon: function () {
                if ('CustomIcon' in coords.weathericon) {
                    t = $c(coords.weathericon.CustomIcon.ImageIndex + data.weathericon);
                    t.style.left = coords.weathericon.CustomIcon.X + "px";
                    t.style.top = coords.weathericon.CustomIcon.Y + "px";
                    view.insert(t, "c_weather_icon");
                } else {
                    t = $c("weather");
                    t.style.left = coords.weathericon.Coordinates.X + "px";
                    t.style.top = coords.weathericon.Coordinates.Y + "px";
                    view.insert(t, "c_weather_icon");
                }
            },
            temp: {
                oneline: function () {
                    var sep = $c(coords.weatheroneline.DelimiterImageIndex),
                        deg = $c(coords.weatheroneline.DegreesImageIndex),
                        minus = data.temp[0] < 0 ? $c(coords.weatheroneline.MinusSignImageIndex) : 0;
                    t = view.makeBlock(coords.weatheroneline.Number, Math.abs(data.temp[0]));
                    if (minus != 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    t.block.push(sep);
                    t.width += sep.width + coords.weatheroneline.Number.Spacing;
                    var t2 = view.makeBlock(coords.weatheroneline.Number, Math.abs(data.temp[1]));
                    minus = data.temp[1] < 0 ? $c(coords.weatheroneline.MinusSignImageIndex) : 0;
                    if (minus != 0) {
                        t2.block.splice(0, 0, minus);
                        t2.width += minus.width;
                    }
                    t.block = t.block.concat(t2.block);
                    t.width += t2.width;
                    t.block.push(deg);
                    t.width += deg.width;
                    view.renderBlock(t.block, t.width, coords.weatheroneline.Number, "c_temp_oneline");
                },
                sep: {
                    day: function () {
                        var minus = data.temp[0] < 0 ? $c(coords.weatherday.MinusImageIndex) : 0;
                        t = view.makeBlock(coords.weatherday.Number, Math.abs(data.temp[0]));
                        if ('DegreesImageIndex' in coords.weatherday) {
                            var deg = $c(coords.weatherday.DegreesImageIndex);
                            t.block.push(deg);
                            t.width += deg.width + coords.weatherday.Number.Spacing;
                        }
                        if (minus != 0) {
                            t.block.splice(0, 0, minus);
                            t.width += minus.width;
                        }
                        view.renderBlock(t.block, t.width, coords.weatherday.Number, "c_temp_sep_day");
                    },
                    night: function () {
                        var minus = data.temp[1] < 0 ? $c(coords.weathernight.MinusImageIndex) : 0;
                        t = view.makeBlock(coords.weathernight.Number, Math.abs(data.temp[1]));
                        if ('DegreesImageIndex' in coords.weathernight) {
                            var deg = $c(coords.weathernight.DegreesImageIndex);
                            t.block.push(deg);
                            t.width += deg.width + coords.weathernight.Number.Spacing;
                        }
                        if (minus != 0) {
                            t.block.splice(0, 0, minus);
                            t.width += minus.width;
                        }
                        view.renderBlock(t.block, t.width, coords.weathernight.Number, "c_temp_sep_night");
                    }
                },
                current: function () {
                    var minus = data.temp[0] < 0 ? $c(coords.weathercur.MinusImageIndex) : 0;
                    t = view.makeBlock(coords.weathercur.Number, Math.abs(data.temp[0]));
                    if ('DegreesImageIndex' in coords.weathercur) {
                        var deg = $c(coords.weathercur.DegreesImageIndex);
                        t.block.push(deg);
                        t.width += deg.width + coords.weathercur.Number.Spacing;
                    }
                    if (minus != 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    view.renderBlock(t.block, t.width, coords.weathercur.Number, "c_temp_cur");
                }
            },
            air: function () {
                view.setPosN(coords.weatherair.Icon, 0, "c_air");
            }
        }
    },
    editor = {
        makeBlock: function (el, id) {
            $("editor").innerHTML +=
                '<div id="' + id + '" style="height:' + ((el.BottomRightY - el.TopLeftY + 1) * 3) + 'px; width:' + ((el.BottomRightX - el.TopLeftX + 1) * 3) + 'px; top:' + (el.TopLeftY * 3) + 'px; left:' + (el.TopLeftX * 3) + 'px;" class="editor-elem"></div>';
        },
        makeImg: function (el, id) {
            $("editor").innerHTML +=
                '<div id="' + id + '" style="height:' + ($(el.ImageIndex).height * 3) + 'px; width:' + ($(el.ImageIndex).width * 3) + 'px; top:' + (el.Y * 3) + 'px; left:' + (el.X * 3) + 'px;" class="editor-elem"></div>';
        },
        makeImgStat: function (el, id) {
            $("editor").innerHTML +=
                '<div id="' + id + '" style="height:' + ($('ImageIndexOn' in el ? el.ImageIndexOn : el.ImageIndexOff).height * 3) + 'px; width:' + ($('ImageIndexOn' in el ? el.ImageIndexOn : el.ImageIndexOff).width * 3) + 'px; top:' + (el.Coordinates.Y * 3) + 'px; left:' + (el.Coordinates.X * 3) + 'px;" class="editor-elem"></div>';
        },
        styleToNum: function (el) {
            return Number(el.replace('px', ''));
        },
        init: function () {
            if (!('designtabversion' in localStorage) || localStorage.designtabversion < data.app.designtabversion)
                localStorage.designtabversion = data.app.designtabversion;
            $("editor").innerHTML = '';
            if ('bg' in coords) {
                var bg = $c(coords.bg.Image.ImageIndex);
                bg.style.left = Number(bg.style.left.replace("px", "")) * 3 + "px";
                bg.style.top = Number(bg.style.top.replace("px", "")) * 3 + "px";
                bg.height *= 3;
                bg.width *= 3;
                bg.removeAttribute("id");
                $("editor").appendChild(bg);
                setTimeout(function () {
                    $("editor").childNodes[0].ondragstart = function () {
                        return false;
                    }
                }, 10);
            }
            if ('time' in coords) {
                this.makeImg(coords.time.Hours.Tens, "e_time_ht");
                this.makeImg(coords.time.Hours.Ones, "e_time_ho");
                this.makeImg(coords.time.Minutes.Tens, "e_time_mt");
                this.makeImg(coords.time.Minutes.Ones, "e_time_mo");
                setTimeout(function () {
                    editor.initdrag('e_time_ht', coords.time.Hours.Tens, "c_time", draw.time.time);
                    editor.initdrag('e_time_ho', coords.time.Hours.Ones, "c_time", draw.time.time);
                    editor.initdrag('e_time_mt', coords.time.Minutes.Tens, "c_time", draw.time.time);
                    editor.initdrag('e_time_mo', coords.time.Minutes.Ones, "c_time", draw.time.time);
                }, 10);
                if ('seconds' in coords) {
                    this.makeImg(coords.seconds.Tens, "e_time_st");
                    this.makeImg(coords.seconds.Ones, "e_time_so");
                    setTimeout(function () {
                        editor.initdrag('e_time_st', coords.seconds.Tens, "c_sec", draw.time.seconds);
                        editor.initdrag('e_time_so', coords.seconds.Ones, "c_sec", draw.time.seconds);
                    }, 10);
                }
                if ('ampm' in coords) {
                    $("editor").innerHTML +=
                        '<div id="e_time_am" style="height:' + ($(coords.ampm.ImageIndexAm).height * 3) + 'px; width:' + ($(coords.ampm.ImageIndexAm).width * 3) + 'px; top:' + (coords.ampm.Y * 3) + 'px; left:' + (coords.ampm.X * 3) + 'px;" class="editor-elem"></div>';
                    setTimeout(function () {
                        editor.initdrag('e_time_am', coords.ampm, "c_time_am", draw.time.time);
                    }, 10);
                }
            }
            if (coords.date) {
                if ('weekday' in coords) {
                    this.makeImg(coords.weekday, "e_date_weekday");
                    setTimeout(function () {
                        editor.initdrag('e_date_weekday', coords.weekday, "c_date_weekday", draw.date.weekday);
                    }, 10);
                }
                if ('dateday' in coords) {
                    this.makeBlock(coords.dateday, "e_date_sep_day");
                    setTimeout(function () {
                        editor.initdrag('e_date_sep_day', coords.dateday, "c_date_sepday", draw.date.sepday);
                    }, 10);
                }
                if ('datemonth' in coords) {
                    this.makeBlock(coords.datemonth, "e_date_sep_month");
                    setTimeout(function () {
                        editor.initdrag('e_date_sep_month', coords.datemonth, "c_date_sepmonth", draw.date.sepmonth);
                    }, 10);
                }
                if ('dateoneline' in coords) {
                    this.makeBlock(coords.dateoneline.Number, "e_date_oneline");
                    setTimeout(function () {
                        editor.initdrag('e_date_oneline', coords.dateoneline.Number, "c_date_oneline", draw.date.oneline);
                    }, 10);
                }
            }
            if (coords.activity) {
                if ('actcal' in coords) {
                    this.makeBlock(coords.actcal, "e_act_cal");
                    setTimeout(function () {
                        editor.initdrag('e_act_cal', coords.actcal, "c_act_cal", draw.activity.cal);
                    }, 10);
                }
                if ('actsteps' in coords) {
                    this.makeBlock(coords.actsteps, "e_act_steps");
                    setTimeout(function () {
                        editor.initdrag('e_act_steps', coords.actsteps, "c_act_steps", draw.activity.steps);
                    }, 10);
                }
                if ('actstepsgoal' in coords) {
                    this.makeBlock(coords.actstepsgoal, "e_act_stepsgoal");
                    setTimeout(function () {
                        editor.initdrag('e_act_stepsgoal', coords.actstepsgoal, "c_act_stepsg", draw.activity.stepsgoal);
                    }, 10);
                }
                if ('actpulse' in coords) {
                    this.makeBlock(coords.actpulse, "e_act_pulse");
                    setTimeout(function () {
                        editor.initdrag('e_act_pulse', coords.actpulse, "c_act_pulse", draw.activity.pulse);
                    }, 10);
                }
                if ('actdist' in coords) {
                    this.makeBlock(coords.actdist.Number, "e_act_distance");
                    setTimeout(function () {
                        editor.initdrag('e_act_distance', coords.actdist.Number, "c_act_distance", draw.activity.distance);
                    }, 10);
                }
            }
            if (coords.battery) {
                if ('batteryicon' in coords) {
                    this.makeImg(coords.batteryicon, "e_battery_icon");
                    setTimeout(function () {
                        editor.initdrag('e_battery_icon', coords.batteryicon, "c_battery_icon", draw.battery.icon);
                    }, 10);
                }
                if ('batterytext' in coords) {
                    this.makeBlock(coords.batterytext, "e_battery_text");
                    setTimeout(function () {
                        editor.initdrag('e_battery_text', coords.batterytext, "c_battery_text", draw.battery.text);
                    }, 10);
                }
                if ('batteryscale' in coords) {}
            }
            if (coords.status) {
                if ('statalarm' in coords) {
                    this.makeImgStat(coords.statalarm, "e_stat_alarm");
                    setTimeout(function () {
                        editor.initdrag('e_stat_alarm', coords.statalarm.Coordinates, "c_stat_alarm", draw.status.alarm);
                    }, 10);
                }
                if ('statbt' in coords) {
                    this.makeImgStat(coords.statbt, "e_stat_bt");
                    setTimeout(function () {
                        editor.initdrag('e_stat_bt', coords.statbt.Coordinates, "c_stat_bt", draw.status.bt);
                    }, 10);
                }
                if ('statdnd' in coords) {
                    this.makeImgStat(coords.statdnd, "e_stat_dnd");
                    setTimeout(function () {
                        editor.initdrag('e_stat_dnd', coords.statdnd.Coordinates, "c_stat_dnd", draw.status.dnd);
                    }, 10);
                }
                if ('statlock' in coords) {
                    this.makeImgStat(coords.statlock, "e_stat_lock");
                    setTimeout(function () {
                        editor.initdrag('e_stat_lock', coords.statlock.Coordinates, "c_stat_lock", draw.status.lock);
                    }, 10);
                }
            }
            if (coords.weather) {
                if ('weathericon' in coords)
                    if ('CustomIcon' in coords.weathericon) {
                        $("editor").innerHTML +=
                            '<div id="e_weather_icon" style="height:' + ($(coords.weathericon.CustomIcon.ImageIndex).height * 3) + 'px; width:' + ($(coords.weathericon.CustomIcon.ImageIndex).width * 3) + 'px; top:' + (coords.weathericon.CustomIcon.Y * 3) + 'px; left:' + (coords.weathericon.CustomIcon.X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function () {
                            editor.initdrag('e_weather_icon', coords.weathericon.CustomIcon, "c_weather_icon", draw.weather.icon);
                        }, 10);
                    } else {
                        $("editor").innerHTML +=
                            '<div id="e_weather_icon" style="height:' + ($("weather").height * 3) + 'px; width:' + ($("weather").width * 3) + 'px; top:' + (coords.weathericon.Coordinates.Y * 3) + 'px; left:' + (coords.weathericon.Coordinates.X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function () {
                            editor.initdrag('e_weather_icon', coords.weathericon.Coordinates, "c_weather_icon", draw.weather.icon);
                        }, 10);
                    }
                if ('weatheroneline' in coords) {
                    this.makeBlock(coords.weatheroneline.Number, "e_weather_temp_today_oneline");
                    setTimeout(function () {
                        editor.initdrag('e_weather_temp_today_oneline', coords.weatheroneline.Number, "c_temp_oneline", draw.weather.temp.oneline);
                    }, 10);
                }
                if ('weatherday' in coords) {
                    this.makeBlock(coords.weatherday.Number, "e_weather_temp_today_sep_day");
                    setTimeout(function () {
                        editor.initdrag('e_weather_temp_today_sep_day', coords.weatherday.Number, "c_temp_sep_day", draw.weather.temp.sep.day);
                    }, 10);
                }
                if ('weathernight' in coords) {
                    this.makeBlock(coords.weathernight.Number, "e_weather_temp_today_sep_night");
                    setTimeout(function () {
                        editor.initdrag('e_weather_temp_today_sep_night', coords.weathernight.Number, "c_temp_sep_night", draw.weather.temp.sep.night);
                    }, 10);
                }
                if ('weathercur' in coords) {
                    this.makeBlock(coords.weathercur.Number, "e_weather_temp_current");
                    setTimeout(function () {
                        editor.initdrag('e_weather_temp_current', coords.weathercur.Number, "c_temp_cur", draw.weather.temp.current);
                    }, 10);
                }
                if ('weatherair' in coords) {
                    this.makeImg(coords.weatherair.Icon, "e_weather_air");
                    setTimeout(function () {
                        editor.initdrag('e_weather_air', coords.weatherair.Icon, "c_air", draw.weather.air);
                    }, 10);
                }
            }
            if (coords.stepsprogress) {
                if ('stepscircle' in coords) {}
                if ('stepslinear' in coords) {
                    for (var i = 0; i < coords.stepslinear.Segments.length; i++) {
                        $("editor").innerHTML +=
                            '<div id="e_steps_linar_' + i + '" style="height:' + ($(coords.stepslinear.StartImageIndex + i).height * 3) + 'px; width:' + ($(coords.stepslinear.StartImageIndex + i).width * 3) + 'px; top:' + (coords.stepslinear.Segments[i].Y * 3) + 'px; left:' + (coords.stepslinear.Segments[i].X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function (i) {
                            editor.initdrag(('e_steps_linar_' + i), coords.stepslinear.Segments[i], "c_steps_linear", draw.stepsprogress.linear);
                        }, 10, i);
                    }
                }
                if ('stepsgoal' in coords) {
                    this.makeImg(coords.stepsgoal, "e_steps_goal");
                    setTimeout(function () {
                        editor.initdrag('e_steps_goal', coords.stepsgoal, "c_steps_goal", draw.stepsprogress.goal);
                    }, 10);
                }
            }
        },
        initdrag: function (el, elcoords, cls, drawF) {
            el = $(el);

            el.onmousedown = function (e) {

                var ed = editor.getOffsetRect($("editor"));
                var coords = getCoords(el);
                var shiftX = e.pageX - coords.left;
                var shiftY = e.pageY - coords.top;

                el.style.position = 'absolute';
                moveAt(e);

                el.style.zIndex = 1000;

                function moveAt(e) {
                    el.style.left = e.pageX - ed.left - shiftX + 'px';
                    el.style.top = e.pageY - ed.top - shiftY + 'px';
                    $("e_coords").innerHTML = "X: " + (editor.styleToNum(el.style.left) - editor.styleToNum(el.style.left) % 3) / 3 + ", Y: " + (editor.styleToNum(el.style.top) - editor.styleToNum(el.style.top) % 3) / 3;
                }

                $("editor").onmousemove = function (e) {
                    moveAt(e);
                };

                el.onmouseup = function () {
                    $("editor").onmousemove = null;
                    el.onmouseup = null;
                    el.style.zIndex = 'auto';
                    el.style.top = editor.styleToNum(el.style.top) > 0 && editor.styleToNum(el.style.top) < 528 ? editor.styleToNum(el.style.top) - editor.styleToNum(el.style.top) % 3 + 'px' : "0px";
                    el.style.left = editor.styleToNum(el.style.left) > 0 && editor.styleToNum(el.style.left) < 528 ? editor.styleToNum(el.style.left) - editor.styleToNum(el.style.left) % 3 + 'px' : "0px";
                    if ('X' in elcoords) {
                        elcoords.X = editor.styleToNum(el.style.left) / 3;
                        elcoords.Y = editor.styleToNum(el.style.top) / 3;
                    } else {
                        var t1 = elcoords.TopLeftX,
                            t2 = elcoords.TopLeftY;
                        elcoords.TopLeftX = editor.styleToNum(el.style.left) / 3;
                        elcoords.TopLeftY = editor.styleToNum(el.style.top) / 3;
                        elcoords.BottomRightX += elcoords.TopLeftX - t1;
                        elcoords.BottomRightY += elcoords.TopLeftY - t2;
                    }
                    removeByClass(cls);
                    drawF();
                    $("e_coords").innerHTML = "Coordinates";
                };

            }

            el.ondragstart = function () {
                return false;
            };

            function getCoords(elem) {
                var box = elem.getBoundingClientRect();
                return {
                    top: box.top + pageYOffset,
                    left: box.left + pageXOffset
                };
            }

        },
        getOffsetRect: function (elem) {
            var box = elem.getBoundingClientRect();

            var body = document.body;
            var docElem = document.documentElement;

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            var top = box.top + scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return {
                top: Math.round(top),
                left: Math.round(left)
            }
        },
        calc: function (el, digitcount) {
            var width = 0,
                height = 0;
            for (var i = 0; i < el.ImagesCount; i++) {
                if ($(el.ImageIndex + i).width > width)
                    width = $(el.ImageIndex + i).width;
                if ($(el.ImageIndex + i).height > height)
                    height = $(el.ImageIndex + i).height;
            }
            width = width * digitcount + el.Spacing * (digitcount - 1);
            if (arguments.length > 2)
                for (var i = 2; i < arguments.length; i++)
                    width += $(arguments[i]).width + el.Spacing;
            if (el.Alignment == "TopRight") {
                el.BottomRightY = el.TopLeftY + height - 1;
                el.TopLeftX = el.BottomRightX - width + 1;
            } else {
                el.BottomRightY = el.TopLeftY + height - 1;
                el.BottomRightX = el.TopLeftX + width - 1;
            }
        },
        makejsbetter: function () {
            if (coords.date) {
                if ('dateday' in coords)
                    this.calc(coords.dateday, 2);
                if ('datemonth' in coords)
                    this.calc(coords.datemonth, 2);
                if ('dateoneline' in coords)
                    this.calc(coords.dateoneline.Number, 4, coords.dateoneline.DelimiterImageIndex);
            }
            if ('batterytext' in coords)
                this.calc(coords.batterytext, 3);
            if (coords.activity) {
                if ('actcal' in coords)
                    this.calc(coords.actcal, 4);
                if ('actsteps' in coords)
                    this.calc(coords.actsteps, 5);
                if ('actstepsgoal' in coords)
                    this.calc(coords.actstepsgoal, 5);
                if ('actpulse' in coords)
                    this.calc(coords.actpulse, 3);
                if ('actdist' in coords)
                    this.calc(coords.actdist.Number, 4, coords.actdist.DecimalPointImageIndex, coords.actdist.SuffixImageIndex);
            }
            if (coords.weather) {
                if ('weatheroneline' in coords)
                    this.calc(coords.weatheroneline.Number, 4, coords.weatheroneline.MinusSignImageIndex, coords.weatheroneline.MinusSignImageIndex, coords.weatheroneline.DelimiterImageIndex, coords.weatheroneline.DegreesImageIndex);
                if ('weatherday' in coords)
                    this.calc(coords.weatherday.Number, 2, coords.weatherday.MinusImageIndex, coords.weatherday.DegreesImageIndex);
                if ('weathernight' in coords)
                    this.calc(coords.weathernight.Number, 2, coords.weathernight.MinusImageIndex, coords.weathernight.DegreesImageIndex);
                if ('weathercur' in coords)
                    this.calc(coords.weathercur.Number, 2, coords.weathercur.MinusImageIndex, coords.weathercur.DegreesImageIndex);
            }
            this.init();
            view.makeWf();
        }
    },
    jsoneditor = {
        togglebutton: function (bt, state) {
            if (state == 1) {
                $(bt).classList.add("uk-button-primary");
                $(bt).classList.remove("uk-button-default");
            } else {
                $(bt).classList.remove("uk-button-primary");
                $(bt).classList.add("uk-button-default");
            }
        },
        updatecode: function () {
            $("codearea").innerHTML = jsoneditor.syntaxHighlight(JSON.stringify(data.export(), null, 4));
            if ($("codearea").innerText.match(this.regexrimg))
                $("defaultimages").classList.add("uk-label-success");
            else
                $("defaultimages").classList.remove("uk-label-success");
            view.makeWf();
            if ('time' in coords) {
                if ('seconds' in coords)
                    this.togglebutton("tgsec", 1);
                else
                    this.togglebutton("tgsec", 0);
                if ('ampm' in coords)
                    this.togglebutton("tg12/24", 1);
                else
                    this.togglebutton("tg12/24", 0);
            }
            if ('weekday' in coords)
                this.togglebutton("tgweekday", 1);
            else
                this.togglebutton("tgweekday", 0);
            if ('dateday' in coords)
                this.togglebutton("tgdateday", 1);
            else
                this.togglebutton("tgdateday", 0);
            if ('datemonth' in coords)
                this.togglebutton("tgdatemonth", 1);
            else
                this.togglebutton("tgdatemonth", 0);
            if ('dateoneline' in coords)
                this.togglebutton("tgdateoneline", 1);
            else
                this.togglebutton("tgdateoneline", 0);
            if ('batteryicon' in coords)
                this.togglebutton("tgbaticon", 1);
            else
                this.togglebutton("tgbaticon", 0);
            if ('batterytext' in coords)
                this.togglebutton("tgbatnum", 1);
            else
                this.togglebutton("tgbatnum", 0);
            if ('statalarm' in coords)
                this.togglebutton("tgstatalarm", 1);
            else
                this.togglebutton("tgstatalarm", 0);
            if ('statbt' in coords)
                this.togglebutton("tgstatbt", 1);
            else
                this.togglebutton("tgstatbt", 0);
            if ('statdnd' in coords)
                this.togglebutton("tgstatdnd", 1);
            else
                this.togglebutton("tgstatdnd", 0);
            if ('statlock' in coords)
                this.togglebutton("tgstatlock", 1);
            else
                this.togglebutton("tgstatlock", 0);
            if ('actcal' in coords)
                this.togglebutton("tgactcalories", 1);
            else
                this.togglebutton("tgactcalories", 0);
            if ('actsteps' in coords)
                this.togglebutton("tgactsteps", 1);
            else
                this.togglebutton("tgactsteps", 0);
            if ('statstepsgoal' in coords)
                this.togglebutton("tgactstepsgoal", 1);
            else
                this.togglebutton("tgactstepsgoal", 0);
            if ('actpulse' in coords)
                this.togglebutton("tgactpulse", 1);
            else
                this.togglebutton("tgactpulse", 0);
            if ('actdist' in coords)
                this.togglebutton("tgactdist", 1);
            else
                this.togglebutton("tgactdist", 0);
            if (coords.weather) {
                if (coords.weathericon)
                    if ('CustomIcon' in coords.weathericon) {
                        this.togglebutton("tgweathercusticon", 1);
                        this.togglebutton("tgweathericon", 0);
                    } else {
                        this.togglebutton("tgweathericon", 1);
                        this.togglebutton("tgweathercusticon", 0);
                    }
                else {
                    this.togglebutton("tgweathericon", 0);
                    this.togglebutton("tgweathercusticon", 0);
                }
                if ('weatheroneline' in coords)
                    this.togglebutton("tgweatheroneline", 1);
                else
                    this.togglebutton("tgweatheroneline", 0);
                if ('weatherday' in coords)
                    this.togglebutton("tgweatherday", 1);
                else
                    this.togglebutton("tgweatherday", 0);
                if ('weathernight' in coords)
                    this.togglebutton("tgweathernight", 1);
                else
                    this.togglebutton("tgweathernight", 0);

                if ('weathercur' in coords)
                    this.togglebutton("tgweathercur", 1);
                else
                    this.togglebutton("tgweathercur", 0);
                if ('weatherair' in coords)
                    this.togglebutton("tgweatherair", 1);
                else
                    this.togglebutton("tgweatherair", 0);
            } else {
                this.togglebutton("tgweathericon", 0);
                this.togglebutton("tgweathercusticon", 0);
                this.togglebutton("tgweatheroneline", 0);
                this.togglebutton("tgweatherday", 0);
                this.togglebutton("tgweathernight", 0);
                this.togglebutton("tgweathercur", 0);
                this.togglebutton("tgweatherair", 0);
            }
            if (coords.stepsprogress) {
                if ('stepslinear' in coords)
                    this.togglebutton("tgstepslinear", 1);
                else
                    this.togglebutton("tgstepslinear", 0);
                if ('stepsgoal' in coords)
                    this.togglebutton("tgactgoalicon", 1);
                else
                    this.togglebutton("tgactgoalicon", 0);
            } else {
                this.togglebutton("tgstepslinear", 0);
                this.togglebutton("tgactgoalicon", 0);
            }
        },
        tgam: function () {
            if ('ampm' in coords) {
                delete coords.ampm;
            } else {
                coords.ampm = {
                    X: 0,
                    Y: 0,
                    ImageIndexAm: 233,
                    ImageIndexPm: 234
                }
            }
            this.updatecode();
            jsoneditor.select('"AmPm":');
        },
        tgsec: function () {
            if ('seconds' in coords) {
                delete coords.seconds;
            } else {
                coords.seconds = {
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
            this.updatecode();
            jsoneditor.select('"Seconds":');
        },
        tgweekday: function () {
            if ('weekday' in coords) {
                delete coords.weekday;
                if (!('monthandday' in coords))
                    coords.date = false;
            } else {
                coords.date = true;
                coords.weekday = {
                    X: 0,
                    Y: 0,
                    ImageIndex: 210,
                    ImagesCount: 7
                }
            }
            this.updatecode();
            jsoneditor.select('"WeekDay":');
        },
        tgdateoneline: function () {
            if ('dateoneline' in coords) {
                delete coords.dateoneline;
                if (!('weekday' in coords))
                    coords.date = false;
                if (!('dateday' in coords || 'datemonth' in coords))
                    delete coords.monthandday;
            } else {
                coords.date = true;
                coords.monthandday = {
                    TwoDigitsMonth: true,
                    TwoDigitsDay: true
                }
                coords.dateoneline = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 45,
                        BottomRightY: 10,
                        Alignment: 'TopLeft',
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    DelimiterImageIndex: 219
                }
            }
            this.updatecode();
            jsoneditor.select('"MonthAndDay":');
        },
        tgdateday: function () {
            if ('dateday' in coords) {
                delete coords.dateday;
                if (!('datemonth' in coords || 'dateoneline' in coords)) {
                    delete coords.monthandday;
                    coords.date = false;
                }
            } else {
                coords.date = true;
                if (!('monthandday' in coords))
                    coords.monthandday = {
                        TwoDigitsMonth: true,
                        TwoDigitsDay: true
                    }
                coords.dateday = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 20,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            }
            this.updatecode();
            jsoneditor.select('"MonthAndDay":');
        },
        tgdatemonth: function () {
            if ('datemonth' in coords) {
                delete coords.datemonth;
                if (!('dateday' in coords || 'dateoneline' in coords)) {
                    delete coords.monthandday;
                    coords.date = false;
                }
            } else {
                coords.date = true;
                if (!('monthandday' in coords))
                    coords.monthandday = {
                        TwoDigitsMonth: true,
                        TwoDigitsDay: true
                    }
                coords.datemonth = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 20,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            }
            this.updatecode();
            jsoneditor.select('"MonthAndDay":');
        },
        tgstatalarm: function () {
            if (!(coords.status))
                coords.status = true;
            if ('statalarm' in coords) {
                delete coords.statalarm;
                if (!('statalarm' in coords || 'statbt' in coords || 'statlock' in coords || 'statdnd' in coords))
                    coords.status = false;
            } else
                coords.statalarm = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    },
                    ImageIndexOn: 224
                }
            this.updatecode();
            jsoneditor.select('"Alarm":');
        },
        tgstatbt: function () {
            if (!(coords.status))
                coords.status = true;
            if ('statbt' in coords) {
                delete coords.statbt;
                if (!('statalarm' in coords || 'statbt' in coords || 'statlock' in coords || 'statdnd' in coords))
                    coords.status = false;
            } else
                coords.statbt = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    },
                    ImageIndexOn: 220,
                    ImageIndexOff: 221
                }
            this.updatecode();
            jsoneditor.select('"Bluetooth":');
        },
        tgstatlock: function () {
            if (!(coords.status))
                coords.status = true;
            if ('statlock' in coords) {
                delete coords.statlock;
                if (!('statalarm' in coords || 'statbt' in coords || 'statlock' in coords || 'statdnd' in coords))
                    coords.status = false;
            } else
                coords.statlock = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    },
                    ImageIndexOn: 223
                }
            this.updatecode();
            jsoneditor.select('"Lock":');
        },
        tgstatdnd: function () {
            if (!(coords.status))
                coords.status = true;
            if ('statdnd' in coords) {
                delete coords.statdnd;
                if (!('statalarm' in coords || 'statbt' in coords || 'statlock' in coords || 'statdnd' in coords))
                    coords.status = false;
            } else
                coords.statdnd = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    },
                    ImageIndexOn: 222
                }
            this.updatecode();
            jsoneditor.select('"DoNotDisturb":');
        },
        tgactsteps: function () {
            if (!(coords.activity))
                coords.activity = true;
            if ('actsteps' in coords) {
                delete coords.actsteps;
                if (!('actsteps' in coords || 'actstepsgoal' in coords || 'actcal' in coords || 'actpulse' in coords || 'actdist' in coords))
                    coords.activity = false;
            } else
                coords.actsteps = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 45,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            this.updatecode();
            jsoneditor.select('"Steps":');
        },
        tgactcal: function () {
            if (!(coords.activity))
                coords.activity = true;
            if ('actcal' in coords) {
                delete coords.actcal;
                if (!('actsteps' in coords || 'actstepsgoal' in coords || 'actcal' in coords || 'actpulse' in coords || 'actdist' in coords))
                    coords.activity = false;
            } else
                coords.actcal = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 35,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            this.updatecode();
            jsoneditor.select('"Calories":');
        },
        tgactpulse: function () {
            if (!(coords.activity))
                coords.activity = true;
            if ('actpulse' in coords) {
                delete coords.actpulse;
                if (!('actsteps' in coords || 'actstepsgoal' in coords || 'actcal' in coords || 'actpulse' in coords || 'actdist' in coords))
                    coords.activity = false;
            } else
                coords.actpulse = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 35,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            this.updatecode();
            jsoneditor.select('"Pulse":');
        },
        tgactstepsgoal: function () {
            if (!(coords.activity))
                coords.activity = true;
            if ('actstepsgoal' in coords) {
                delete coords.actstepsgoal;
                if (!('actsteps' in coords || 'actstepsgoal' in coords || 'actcal' in coords || 'actpulse' in coords || 'actdist' in coords))
                    coords.activity = false;
            } else
                coords.actstepsgoal = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 45,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            this.updatecode();
            jsoneditor.select('"StepsGoal":');
        },
        tgactdist: function () {
            if (!(coords.activity))
                coords.activity = true;
            if ('actdist' in coords) {
                delete coords.actdist;
                if (!('actsteps' in coords || 'actstepsgoal' in coords || 'actcal' in coords || 'actpulse' in coords || 'actdist' in coords))
                    coords.activity = false;
            } else
                coords.actdist = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 45,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    SuffixImageIndex: 231,
                    DecimalPointImageIndex: 232
                }
            this.updatecode();
            jsoneditor.select('"Distance":');
        },
        tgbatteryicon: function () {
            if (!(coords.battery))
                coords.battery = true;
            if ('batteryicon' in coords) {
                delete coords.batteryicon;
                if (!('batterytext' in coords))
                    coords.battery = false;
            } else
                coords.batteryicon = {
                    X: 0,
                    Y: 0,
                    ImageIndex: 225,
                    ImagesCount: 6
                }
            this.updatecode();
            jsoneditor.select('"Battery":');
        },
        tgbatterytext: function () {
            if (!(coords.battery))
                coords.battery = true;
            if ('batterytext' in coords) {
                delete coords.batterytext;
                if (!('batteryicon' in coords))
                    coords.battery = false;
            } else
                coords.batterytext = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 10,
                    BottomRightY: 20,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            this.updatecode();
            jsoneditor.select('"Battery":');
        },
        tgweathericon: function () {
            if (!(coords.weather))
                coords.weather = true;
            if (coords.weathericon) {
                delete coords.weathericon;
                if (!('weathericon' in coords || 'weatherair' in coords || 'weatheroneline' in coords || 'weathercur' in coords || 'weatherday' in coords || 'weathernight' in coords))
                    coords.weather = false;
            } else
                coords.weathericon = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    }
                }
            this.updatecode();
            jsoneditor.select('"Weather":');
        },
        tgweathericoncustom: function () {
            if (!(coords.weather))
                coords.weather = true;
            if (coords.weathericon) {
                delete coords.weathericon;
                if (!('weathericon' in coords || 'weatherair' in coords || 'weatheroneline' in coords || 'weathercur' in coords || 'weatherday' in coords || 'weathernight' in coords))
                    coords.weather = false;
            } else
                coords.weathericon = {
                    CustomIcon: {
                        X: 0,
                        Y: 0,
                        ImageIndex: 267,
                        ImagesCount: 26
                    }
                }
            this.updatecode();
            jsoneditor.select('"Weather":');
        },
        tgweatherair: function () {
            if (!(coords.weather))
                coords.weather = true;
            if ('weatherair' in coords) {
                delete coords.weatherair;
                if (!('weathericon' in coords || 'weatherair' in coords || 'weatheroneline' in coords || 'weathercur' in coords || 'weatherday' in coords || 'weathernight' in coords))
                    coords.weather = false;
            } else
                coords.weatherair = {
                    Icon: {
                        X: 0,
                        Y: 0,
                        ImageIndex: 235,
                        ImagesCount: 6
                    }
                }
            this.updatecode();
            jsoneditor.select('"Weather":');
        },
        tgweatheroneline: function () {
            if (!(coords.weather))
                coords.weather = true;
            if ('weatheroneline' in coords) {
                delete coords.weatheroneline;
                if (!('weathericon' in coords || 'weatherair' in coords || 'weatheroneline' in coords || 'weathercur' in coords || 'weatherday' in coords || 'weathernight' in coords))
                    coords.weather = false;
            } else
                coords.weatheroneline = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 50,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusSignImageIndex: 217,
                    DelimiterImageIndex: 219,
                    AppendDegreesForBoth: false,
                    DegreesImageIndex: 218
                }
            this.updatecode();
            jsoneditor.select('"Temperature":');
        },
        tgweathercur: function () {
            if (!(coords.weather))
                coords.weather = true;
            if ('weathercur' in coords) {
                delete coords.weathercur;
                if (!('weathericon' in coords || 'weatherair' in coords || 'weatheroneline' in coords || 'weathercur' in coords || 'weatherday' in coords || 'weathernight' in coords))
                    coords.weather = false;
            } else
                coords.weathercur = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 20,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusImageIndex: 217,
                    DegreesImageIndex: 218
                }
            this.updatecode();
            jsoneditor.select('"Temperature":');
        },
        tgweatherday: function () {
            if (!(coords.weather))
                coords.weather = true;
            if ('weatherday' in coords) {
                delete coords.weatherday;
                if (!('weathericon' in coords || 'weatherair' in coords || 'weatheroneline' in coords || 'weathercur' in coords || 'weatherday' in coords || 'weathernight' in coords))
                    coords.weather = false;
            } else
                coords.weatherday = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 20,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusImageIndex: 217,
                    DegreesImageIndex: 218
                }
            this.updatecode();
            jsoneditor.select('"Temperature":');
        },
        tgweathernight: function () {
            if (!(coords.weather))
                coords.weather = true;
            if ('weathernight' in coords) {
                delete coords.weathernight;
                if (!('weathericon' in coords || 'weatherair' in coords || 'weatheroneline' in coords || 'weathercur' in coords || 'weatherday' in coords || 'weathernight' in coords))
                    coords.weather = false;
            } else
                coords.weathernight = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 20,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusImageIndex: 217,
                    DegreesImageIndex: 218
                }
            this.updatecode();
            jsoneditor.select('"Temperature":');
        },
        tgstepsgoal: function () {
            if (!(coords.stepsprogress))
                coords.stepsprogress = true;
            if ('stepsgoal' in coords) {
                delete coords.stepsgoal;
                if (!('stepslinear' in coords || 'stepsgoal' in coords || 'stepscircle' in coords))
                    coords.stepsprogress = false;
            } else
                coords.stepsgoal = {
                    X: 0,
                    Y: 0,
                    ImageIndex: 266
                }
            this.updatecode();
            jsoneditor.select('"GoalImage":');
        },
        tgstepslinear: function () {
            if (!(coords.stepsprogress))
                coords.stepsprogress = true;
            if ('stepslinear' in coords) {
                delete coords.stepslinear;
                if (!('stepslinear' in coords || 'stepsgoal' in coords || 'stepscircle' in coords))
                    coords.stepsprogress = false;
            } else
                coords.stepslinear = {
                    StartImageIndex: 200,
                    Segments: [
                        {
                            X: 40,
                            Y: 121
                        },
                        {
                            X: 55,
                            Y: 121
                        },
                        {
                            X: 67,
                            Y: 121
                        },
                        {
                            X: 79,
                            Y: 121
                        },
                        {
                            X: 91,
                            Y: 121
                        },
                        {
                            X: 104,
                            Y: 121
                        },
                        {
                            X: 117,
                            Y: 121
                        },
                        {
                            X: 130,
                            Y: 121
                        }
                    ]
                }
            this.updatecode();
            jsoneditor.select('"Linear":');
        },
        disablesec: function () {
            if (coords.analog)
                if ('analogseconds' in coords) {
                    coords.analogminutes.CenterImage = coords.analogseconds.CenterImage;
                    delete coords.analogseconds;
                    this.updatecode();
                }
        },
        select: function (s) {
            var target = this.findspan(s);
            if (!target) return 0;
            var rng, sel;
            rng = document.createRange();
            rng.selectNode(target.childNodes[0])
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(rng);
            $("codearea").scrollTop = target.offsetTop - 200;
        },
        findspan: function (s) {
            for (var i = 0; i < $("codearea").childNodes.length; i++)
                if ($("codearea").childNodes[i].tagName == 'SPAN')
                    if ($("codearea").childNodes[i].childNodes[0].data == s)
                        return $("codearea").childNodes[i];
        },
        fillarea: function () {
            if (!('editortabversion' in localStorage) || localStorage.editortabversion < data.app.editortabversion)
                localStorage.editortabversion = data.app.editortabversion;
            this.updatecode();
            if (data.app.firstopen_editor) {
                sessionStorage.firstopen_editor = false;
                UIkit.notification(('jsonupdate' in data.app.lang ? data.app.lang.jsonupdate : "To update preview just click out of JSON input"), {
                    status: 'primary',
                    pos: 'top-left',
                    timeout: 3000
                });
                data.app.firstopen_editor = false;
            }
        },
        syntaxHighlight: function (json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        },
        exportjs: function () {
            if (data.app.edgeBrowser) {
                var blob = new Blob([JSON.stringify(data.export(), null, 4)], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, data.wfname + '.json');
            } else {
                var a = document.createElement('a');
                a.href = 'data:application/octet-stream;base64, ' + btoa(JSON.stringify(data.export(), null, 4));
                a.download = data.wfname + '.json';
                a.click();
            }
        },
        makepng: function () {
            var el = "watchfaceblock";
            if ($("makepngwithwatch").checked)
                el = "watchfaceimage";
            html2canvas($(el), {
                onrendered: function (canvas) {
                    ctx = canvas.getContext("2d");
                    if (data.app.edgeBrowser) {
                        canvas.toBlob(function (blob) {
                            saveAs(blob, data.wfname + ".png");
                        });
                    } else {
                        var a = document.createElement('a');
                        a.href = canvas.toDataURL("image/png");
                        a.download = data.wfname + '.png';
                        a.click();
                        delete a;
                    }
                }
            });
        },
        codeareablur: function () {
            try {
                data.import(jsonlint.parse($("codearea").innerText));
                this.updatecode();
            } catch (error) {
                $("jsonerrortext").innerHTML = error;

                function show() {
                    UIkit.modal($("jsonerrormodal")).show()
                }
                setTimeout(show, 250);
                console.warn(error);
            }
        },
        regexr: /<\/?\w*>|<\w*\s\w*="#[\w\d]{6}">|<([\w\s]*="[\s\w:(,);\-&.]*")*>/g,
        regexrimg: /"(Suffix|DecimalPoint|MinusSign|Degrees|Minus|)ImageIndex(On|Off|Am|Pm|)":\s(2|3)\d\d/g
    },
    imagestab = {
        init: function () {
            if (!('imagestabversion' in localStorage) || localStorage.imagestabversion < data.app.imagestabversion)
                localStorage.imagestabversion = data.app.imagestabversion;
            $("imagesinuse").innerHTML = '';
            $("imagesavalible").innerHTML = '';
            if ('bg' in coords)
                this.insertimg({
                    label: "Background"
                }, coords.bg.Image.ImageIndex);
            if ('time' in coords) {
                this.insertimg({
                    label: "Time hours tens"
                }, coords.time.Hours.Tens.ImageIndex, coords.time.Hours.Tens.ImagesCount);
                this.insertimg({
                    label: "Time hours ones"
                }, coords.time.Hours.Ones.ImageIndex, coords.time.Hours.Ones.ImagesCount);
                this.insertimg({
                    label: "Time minutes tens"
                }, coords.time.Minutes.Tens.ImageIndex, coords.time.Minutes.Tens.ImagesCount);
                this.insertimg({
                    label: "Time minutes ones"
                }, coords.time.Minutes.Ones.ImageIndex, coords.time.Minutes.Ones.ImagesCount);
                if ('seconds' in coords) {
                    this.insertimg({
                        label: "Time seconds tens"
                    }, coords.seconds.Tens.ImageIndex, coords.seconds.Tens.ImagesCount);
                    this.insertimg({
                        label: "Time seconds ones"
                    }, coords.seconds.Ones.ImageIndex, coords.seconds.Ones.ImagesCount);
                }
                if ('ampm' in coords)
                    this.insertimg({
                        label: "Time am/pm"
                    }, coords.ampm.ImageIndexAm, 1, coords.ampm.ImageIndexPm);
            }
            if (coords.date) {
                if ('weekday' in coords) {
                    this.insertimg({
                        label: "Week day"
                    }, coords.weekday.ImageIndex, coords.weekday.ImagesCount);
                }
                if ('datesepday' in coords) {
                    this.insertimg({
                        label: "Date day"
                    }, coords.dateday.ImageIndex, coords.dateday.ImagesCount);
                }
                if ('datesepmonth' in coords) {
                    this.insertimg({
                        label: "Date month"
                    }, coords.datemonth.ImageIndex, coords.datemonth.ImagesCount);
                }
                if ('dateoneline' in coords) {
                    this.insertimg({
                        label: "Date oneline",
                        addition: (", " + coords.dateoneline.DelimiterImageIndex)
                    }, coords.dateoneline.Number.ImageIndex, coords.dateoneline.Number.ImagesCount, coords.dateoneline.DelimiterImageIndex);
                }
            }
            if (coords.battery) {
                if ('batteryicon' in coords)
                    this.insertimg({
                        label: "Battery icon"
                    }, coords.batteryicon.ImageIndex, coords.batteryicon.ImagesCount);
                if ('batterytext' in coords)
                    this.insertimg({
                        label: "Battery text"
                    }, coords.batterytext.ImageIndex, coords.batterytext.ImagesCount);
                if ('batteryscale' in coords)
                    this.insertimg({
                        label: "Battery scale"
                    }, coords.batteryscale.StartImageIndex, coords.batteryscale.Segments.length);
            }
            if (coords.status) {
                if ('statalarm' in coords)
                    this.insertimg({
                        label: "Status alarm"
                    }, coords.statalarm.ImageIndexOn, 1);
                if ('statbt' in coords)
                    this.insertimg({
                        label: "Status bluetooth",
                        addition: (", " + coords.statbt.ImageIndexOff)
                    }, coords.statbt.ImageIndexOn, 1, coords.statbt.ImageIndexOff);
                if ('statdnd' in coords)
                    this.insertimg({
                        label: "Status do not disturb"
                    }, coords.statdnd.ImageIndexOn, 1);
                if ('statlock' in coords)
                    this.insertimg({
                        label: "Status lock"
                    }, coords.statlock.ImageIndexOn, 1);
            }
            if (coords.activity) {
                if ('actcal' in coords)
                    this.insertimg({
                        label: "Activity calories"
                    }, coords.actcal.ImageIndex, coords.actcal.ImagesCount);
                if ('actsteps' in coords)
                    this.insertimg({
                        label: "Activity steps"
                    }, coords.actsteps.ImageIndex, coords.actsteps.ImagesCount);
                if ('statstepsgoal' in coords)
                    this.insertimg({
                        label: "Activity steps goal"
                    }, coords.actstepsgoal.ImageIndex, coords.actstepsgoal.ImagesCount);
                if ('actpulse' in coords)
                    this.insertimg({
                        label: "Activity pulse"
                    }, coords.actpulse.ImageIndex, coords.actpulse.ImagesCount);
                if ('actdist' in coords)
                    this.insertimg({
                        label: "Activity distance",
                        addition: (", " + coords.actdist.DecimalPointImageIndex + ", " + coords.actdist.SuffixImageIndex)
                    }, coords.actdist.Number.ImageIndex, coords.actdist.Number.ImagesCount, coords.actdist.DecimalPointImageIndex, coords.actdist.SuffixImageIndex);
            }
            if (coords.weather) {
                if (coords.weathericon)
                    if ('CustomIcon' in coords.weathericon) {
                        this.insertimg({
                            label: "Weather icons"
                        }, coords.weathericon.CustomIcon.ImageIndex, coords.weathericon.CustomIcon.ImagesCount);
                    }
                if ('weatheroneline' in coords)
                    this.insertimg({
                        label: "Weather oneline",
                        addition: (", " + coords.weatheroneline.MinusSignImageIndex + ", " + coords.weatheroneline.DelimiterImageIndex + ", " + coords.weatheroneline.DegreesImageIndex)
                    }, coords.weatheroneline.Number.ImageIndex, coords.weatheroneline.Number.ImagesCount, coords.weatheroneline.MinusSignImageIndex, coords.weatheroneline.DelimiterImageIndex, coords.weatheroneline.DegreesImageIndex);
                if ('weatherday' in coords)
                    this.insertimg({
                        label: "Weather day",
                        addition: (", " + coords.weatherday.MinusImageIndex)
                    }, coords.weatherday.Number.ImageIndex, coords.weatherday.Number.ImagesCount, coords.weatherday.MinusImageIndex);
                if ('weathernight' in coords)
                    this.insertimg({
                        label: "Weather night",
                        addition: (", " + coords.weathernight.MinusImageIndex)
                    }, coords.weathernight.Number.ImageIndex, coords.weathernight.Number.ImagesCount, coords.weathernight.MinusImageIndex);

                if ('weathercur' in coords)
                    this.insertimg({
                        label: "Weather current",
                        addition: (", " + coords.weathercur.MinusImageIndex + ", " + coords.weathercur.DegreesImageIndex)
                    }, coords.weathercur.Number.ImageIndex, coords.weathercur.Number.ImagesCount, coords.weathercur.MinusImageIndex, coords.weathercur.DegreesImageIndex);
                if ('weatherair' in coords)
                    this.insertimg({
                        label: "Weather air pollution"
                    }, coords.weatherair.Icon.ImageIndex, coords.weatherair.Icon.ImagesCount);
            }
            if (coords.stepsprogress) {
                if ('stepslinear' in coords)
                    this.insertimg({
                        label: "Steps progress"
                    }, coords.stepslinear.StartImageIndex, coords.stepslinear.Segments.length);
                if ('stepsgoal' in coords)
                    this.insertimg({
                        label: "Goal image"
                    }, coords.stepsgoal.ImageIndex, 1);
            }
            this.insertimg({
                label: "Big digits",
                insertto: "imagesavalible"
            }, 255, 10);
            this.insertimg({
                label: "Digits",
                insertto: "imagesavalible"
            }, 200, 10);
            this.insertimg({
                label: "Week days",
                insertto: "imagesavalible"
            }, 210, 7);
            this.insertimg({
                label: "Week days russian",
                insertto: "imagesavalible"
            }, 241, 7);
            this.insertimg({
                label: "Week days russian inverted",
                insertto: "imagesavalible"
            }, 248, 7);
            this.insertimg({
                label: "Battery icon",
                insertto: "imagesavalible"
            }, 225, 6);
            this.insertimg({
                label: "Air pollution",
                insertto: "imagesavalible"
            }, 235, 6);
            this.insertimg({
                label: "Weather symbols",
                insertto: "imagesavalible",
                addition: ", 218, 219"
            }, 217, 3);
            this.insertimg({
                label: "Bluetooth",
                insertto: "imagesavalible",
                addition: ", 221"
            }, 220, 2);
            this.insertimg({
                label: "Distance symbols",
                insertto: "imagesavalible",
                addition: ", 232"
            }, 231, 2);
            this.insertimg({
                label: "Am/Pm",
                insertto: "imagesavalible",
                addition: ", 234"
            }, 233, 2);
            this.insertimg({
                label: "Status images",
                insertto: "imagesavalible",
                addition: ", 223, 224"
            }, 222, 3);
            this.insertimg({
                label: "Steps goal image",
                insertto: "imagesavalible"
            }, 266, 1);
            this.insertimg({
                label: "Weather icons",
                insertto: "imagesavalible"
            }, 267, 26);
        },
        insertimg: function (name, imageindex, imagescount) {
            if (!('insertto' in name))
                name.insertto = "imagesinuse";
            if (!('addition' in name))
                name.addition = "";
            if (imagescount == undefined) imagescount = 1;
            if (imageindex == undefined) {
                imagescount = 0;
                imageindex = '';
                name.addition = name.addition.slice(2);
            }
            $(name.insertto).innerHTML += '<div class="imagessection"><div><span class="imagessection-h">' + name.label + '</span><span class="imagessection-description">ImageIndex: ' + imageindex + name.addition + '</span></div><div class="imagessection-images"></div></div>';
            if (((imageindex - imageindex % 100) / 100 == 2) || ((imageindex - imageindex % 100) / 100 == 3))
                $(name.insertto).lastChild.classList.add("imagessection-def");
            for (var i = 0; i < imagescount; i++) {
                $(name.insertto).lastChild.lastChild.appendChild($c(imageindex + i));
                $(name.insertto).lastChild.lastChild.lastChild.removeAttribute("id");
            }
            if (arguments.length > 3)
                for (var i = 3; i < arguments.length; i++) {
                    $(name.insertto).lastChild.lastChild.appendChild($c(arguments[i]));
                    $(name.insertto).lastChild.lastChild.lastChild.removeAttribute("id");
                }
        }
    };

init();
