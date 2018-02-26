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

var wfe = {
        app: {
            changeLang: function (lang) {
                try {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', 'assets/translation/' + lang + '.json', false);
                    xhr.send();
                    if (xhr.status == 200) {
                        wfe.app.lang = JSON.parse(xhr.responseText);
                        var strings = document.querySelectorAll('[data-translate-id]');
                        for (var i = 0; i < strings.length; i++) {
                            if (strings[i].dataset.translateId in wfe.app.lang)
                                if (strings[i].dataset.link == undefined)
                                    strings[i].innerHTML = wfe.app.lang[strings[i].dataset.translateId];
                                else
                                    strings[i].innerHTML = wfe.app.lang[strings[i].dataset.translateId].replace('$link', strings[i].dataset.link);
                        }
                    } else
                        throw ("Respanse status: " + xhr.status);
                } catch (error) {
                    console.warn("Loading translation error", error);
                    UIkit.notification('<b>Loading translation error: </b>' + error, {
                        status: 'danger',
                        pos: 'top-left',
                        timeout: 5000
                    });
                }
            },
            changeTheme: function () {
                if (document.body.classList.contains('uk-light')) {
                    localStorage.appTheme = 'light';
                    document.body.classList.remove('uk-light');
                    document.getElementsByTagName('html')[0].classList.remove('uk-background-secondary');
                    $('vars').classList.remove('uk-card-secondary');
                    $('modal-howto').childNodes[1].classList.remove('uk-background-secondary');
                    $('modal-about').childNodes[1].classList.remove('uk-background-secondary');
                    $('modal-donate').childNodes[1].classList.remove('uk-background-secondary');
                    $('jsonerrormodal').childNodes[1].classList.remove('uk-background-secondary');
                    $('modal-preview').childNodes[1].classList.remove('uk-background-secondary');
                    $('modal-settings').childNodes[1].classList.remove('uk-background-secondary');
                } else {
                    localStorage.appTheme = 'dark';
                    document.body.classList.add('uk-light');
                    document.getElementsByTagName('html')[0].classList.add('uk-background-secondary');
                    $('vars').classList.add('uk-card-secondary');
                    $('modal-howto').childNodes[1].classList.add('uk-background-secondary');
                    $('modal-about').childNodes[1].classList.add('uk-background-secondary');
                    $('modal-donate').childNodes[1].classList.add('uk-background-secondary');
                    $('jsonerrormodal').childNodes[1].classList.add('uk-background-secondary');
                    $('modal-preview').childNodes[1].classList.add('uk-background-secondary');
                    $('modal-settings').childNodes[1].classList.add('uk-background-secondary');
                }
            },
            lastimage: 300,
            imagestabversion: 2,
            editortabversion: 1,
            designtabversion: 1,
            analogtabversion: 2,
            notWebkitBased: undefined,
            lang: {},
            local: (location.protocol != "file:" ? false : true),
            firstopen_editor: ('firstopen_editor' in sessionStorage ? false : true)
        },
        data: {
            import: function (json) {
                wfe.coords = {};
                if ('Background' in json)
                    wfe.coords.bg = json.Background;
                if ('Time' in json) {
                    wfe.coords.time = json.Time;
                    if ('Seconds' in json.Time) {
                        wfe.coords.seconds = json.Time.Seconds;
                        delete wfe.coords.time.Seconds;
                    }
                    if ('AmPm' in json.Time) {
                        wfe.coords.ampm = json.Time.AmPm;
                        delete wfe.coords.time.AmPm;
                    }
                }
                if ('Date' in json) {
                    wfe.coords.date = true;
                    if ('WeekDay' in json.Date)
                        wfe.coords.weekday = json.Date.WeekDay;
                    if ('MonthAndDay' in json.Date) {
                        wfe.coords.monthandday = json.Date.MonthAndDay;
                        if ('Separate' in json.Date.MonthAndDay) {
                            if ('Day' in json.Date.MonthAndDay.Separate)
                                wfe.coords.dateday = json.Date.MonthAndDay.Separate.Day;
                            if ('Month' in json.Date.MonthAndDay.Separate)
                                wfe.coords.datemonth = json.Date.MonthAndDay.Separate.Month;
                            delete wfe.coords.monthandday.Separate;
                        }
                        if ('OneLine' in json.Date.MonthAndDay) {
                            wfe.coords.dateoneline = json.Date.MonthAndDay.OneLine;
                            delete wfe.coords.monthandday.OneLine;
                        }
                    }
                } else
                    wfe.coords.date = false;
                if ('Battery' in json) {
                    wfe.coords.battery = true;
                    if ('Icon' in json.Battery)
                        wfe.coords.batteryicon = json.Battery.Icon;
                    if ('Text' in json.Battery)
                        wfe.coords.batterytext = json.Battery.Text;
                    if ('Scale' in json.Battery)
                        wfe.coords.batteryscale = json.Battery.Scale;
                } else
                    wfe.coords.battery = false;
                if ('Status' in json) {
                    wfe.coords.status = true;
                    if ('Alarm' in json.Status)
                        wfe.coords.statalarm = json.Status.Alarm;
                    if ('Bluetooth' in json.Status)
                        wfe.coords.statbt = json.Status.Bluetooth;
                    if ('DoNotDisturb' in json.Status)
                        wfe.coords.statdnd = json.Status.DoNotDisturb;
                    if ('Lock' in json.Status)
                        wfe.coords.statlock = json.Status.Lock;
                } else
                    wfe.coords.status = false;
                if ('Activity' in json) {
                    wfe.coords.activity = true;
                    if ('Calories' in json.Activity)
                        wfe.coords.actcal = json.Activity.Calories;
                    if ('Steps' in json.Activity)
                        wfe.coords.actsteps = json.Activity.Steps;
                    if ('StepsGoal' in json.Activity)
                        wfe.coords.actstepsgoal = json.Activity.StepsGoal;
                    if ('Pulse' in json.Activity)
                        wfe.coords.actpulse = json.Activity.Pulse;
                    if ('Distance' in json.Activity)
                        wfe.coords.actdist = json.Activity.Distance;
                } else
                    wfe.coords.activity = false;
                if ('Weather' in json) {
                    wfe.coords.weather = true;
                    if ('Icon' in json.Weather)
                        wfe.coords.weathericon = json.Weather.Icon;
                    if ('Temperature' in json.Weather) {
                        if ('Today' in json.Weather.Temperature) {
                            if ('OneLine' in json.Weather.Temperature.Today)
                                wfe.coords.weatheroneline = json.Weather.Temperature.Today.OneLine;
                            if ('Separate' in json.Weather.Temperature.Today) {
                                if ('Day' in json.Weather.Temperature.Today.Separate)
                                    wfe.coords.weatherday = json.Weather.Temperature.Today.Separate.Day;
                                if ('Night' in json.Weather.Temperature.Today.Separate)
                                    wfe.coords.weathernight = json.Weather.Temperature.Today.Separate.Night;
                            }
                        }
                        if ('Current' in json.Weather.Temperature)
                            wfe.coords.weathercur = json.Weather.Temperature.Current;
                    }
                    if ('AirPollution' in json.Weather)
                        wfe.coords.weatherair = json.Weather.AirPollution;
                } else
                    wfe.coords.weather = false;
                if ('StepsProgress' in json) {
                    wfe.coords.stepsprogress = true;
                    if ('Circle' in json.StepsProgress)
                        wfe.coords.stepscircle = json.StepsProgress.Circle;
                    if ('Linear' in json.StepsProgress)
                        wfe.coords.stepslinear = json.StepsProgress.Linear;
                    if ('GoalImage' in json.StepsProgress)
                        wfe.coords.stepsgoal = json.StepsProgress.GoalImage;
                } else
                    wfe.coords.stepsprogress = false;
                if ('AnalogDialFace' in json) {
                    wfe.coords.analog = true;
                    if ('Hours' in json.AnalogDialFace)
                        wfe.coords.analoghours = json.AnalogDialFace.Hours;
                    if ('Minutes' in json.AnalogDialFace)
                        wfe.coords.analogminutes = json.AnalogDialFace.Minutes;
                    if ('Seconds' in json.AnalogDialFace)
                        wfe.coords.analogseconds = json.AnalogDialFace.Seconds;
                } else
                    wfe.coords.analog = false;
            },
            export: function () {
                var packed = {};
                if ('bg' in wfe.coords)
                    packed.Background = wfe.coords.bg;
                if ('time' in wfe.coords) {
                    packed.Time = JSON.parse(JSON.stringify(wfe.coords.time));
                    if ('seconds' in wfe.coords)
                        packed.Time.Seconds = wfe.coords.seconds;
                    if ('ampm' in wfe.coords)
                        packed.Time.AmPm = wfe.coords.ampm;
                }
                if (wfe.coords.date) {
                    packed.Date = {};
                    if ('weekday' in wfe.coords)
                        packed.Date.WeekDay = wfe.coords.weekday;
                    if ('monthandday' in wfe.coords) {
                        packed.Date.MonthAndDay = wfe.coords.monthandday;
                        if ('dateday' in wfe.coords || 'datemonth' in wfe.coords) {
                            packed.Date.MonthAndDay.Separate = {};
                            if ('dateday' in wfe.coords)
                                packed.Date.MonthAndDay.Separate.Day = wfe.coords.dateday;
                            if ('datemonth' in wfe.coords)
                                packed.Date.MonthAndDay.Separate.Month = wfe.coords.datemonth;
                        }
                        if ('dateoneline' in wfe.coords)
                            packed.Date.MonthAndDay.OneLine = wfe.coords.dateoneline;
                    }
                }
                if (wfe.coords.status) {
                    packed.Status = {};
                    if ('statalarm' in wfe.coords)
                        packed.Status.Alarm = wfe.coords.statalarm;
                    if ('statbt' in wfe.coords)
                        packed.Status.Bluetooth = wfe.coords.statbt;
                    if ('statdnd' in wfe.coords)
                        packed.Status.DoNotDisturb = wfe.coords.statdnd;
                    if ('statlock' in wfe.coords)
                        packed.Status.Lock = wfe.coords.statlock;
                }
                if (wfe.coords.battery) {
                    packed.Battery = {};
                    if ('batteryicon' in wfe.coords)
                        packed.Battery.Icon = wfe.coords.batteryicon;
                    if ('batterytext' in wfe.coords)
                        packed.Battery.Text = wfe.coords.batterytext;
                    if ('batteryscale' in wfe.coords)
                        packed.Battery.Scale = wfe.coords.batteryscale;
                }
                if (wfe.coords.activity) {
                    packed.Activity = {};
                    if ('actcal' in wfe.coords)
                        packed.Activity.Calories = wfe.coords.actcal;
                    if ('actsteps' in wfe.coords)
                        packed.Activity.Steps = wfe.coords.actsteps;
                    if ('actstepsgoal' in wfe.coords)
                        packed.Activity.StepsGoal = wfe.coords.actstepsgoal;
                    if ('actpulse' in wfe.coords)
                        packed.Activity.Pulse = wfe.coords.actpulse;
                    if ('actdist' in wfe.coords)
                        packed.Activity.Distance = wfe.coords.actdist;
                }
                if (wfe.coords.weather) {
                    packed.Weather = {};
                    if ('weathericon' in wfe.coords)
                        packed.Weather.Icon = wfe.coords.weathericon;
                    if ('weathercur' in wfe.coords || 'weatherday' in wfe.coords || 'weathernight' in wfe.coords || 'weatheroneline' in wfe.coords) {
                        packed.Weather.Temperature = {};
                        if ('weatherday' in wfe.coords || 'weathernight' in wfe.coords || 'weatheroneline' in wfe.coords) {
                            packed.Weather.Temperature.Today = {};
                            if ('weatheroneline' in wfe.coords)
                                packed.Weather.Temperature.Today.OneLine = wfe.coords.weatheroneline;
                            if ('weatherday' in wfe.coords || 'weathernight' in wfe.coords) {
                                packed.Weather.Temperature.Today.Separate = {};
                                if ('weatherday' in wfe.coords)
                                    packed.Weather.Temperature.Today.Separate.Day = wfe.coords.weatherday;
                                if ('weathernight' in wfe.coords)
                                    packed.Weather.Temperature.Today.Separate.Night = wfe.coords.weathernight;
                            }
                        }
                        if ('weathercur' in wfe.coords)
                            packed.Weather.Temperature.Current = wfe.coords.weathercur;
                    }
                    if ('weatherair' in wfe.coords)
                        packed.Weather.AirPollution = wfe.coords.weatherair;
                }
                if (wfe.coords.stepsprogress) {
                    packed.StepsProgress = {};
                    if ('stepscircle' in wfe.coords)
                        packed.StepsProgress.Circle = wfe.coords.stepscircle;
                    if ('stepslinear' in wfe.coords)
                        packed.StepsProgress.Linear = wfe.coords.stepslinear;
                    if ('stepsgoal' in wfe.coords)
                        packed.StepsProgress.GoalImage = wfe.coords.stepsgoal;
                }
                if (wfe.coords.analog) {
                    packed.AnalogDialFace = {};
                    if ('analoghours' in wfe.coords)
                        packed.AnalogDialFace.Hours = wfe.coords.analoghours;
                    if ('analogminutes' in wfe.coords)
                        packed.AnalogDialFace.Minutes = wfe.coords.analogminutes;
                    if ('analogseconds' in wfe.coords)
                        packed.AnalogDialFace.Seconds = wfe.coords.analogseconds;
                }
                return packed;
            },
            timeOnClock: ["20", "38"],
            seconds: [4, 3],
            analog: [259, 228, 60],
            weekDay: 2,
            day: 6,
            month: 12,
            battery: 20,
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
        init: function () {
            if (localStorage.device == undefined)
                localStorage.device = "bip";
            var device = document.getElementsByName('device');
            for (var i = 0; i < device.length; i++) {
                if (device[i].value == localStorage.device)
                    device[i].checked = true;
                device[i].onchange = function () {
                    for (var i = 0; i < device.length; i++)
                        if (device[i].checked) {
                            localStorage.device = device[i].value;
                            location.reload();
                        }
                }
            }
            if (localStorage.device == "cor") {
                document.getElementsByTagName("main")[0].classList.remove('bip');
                document.getElementsByTagName("main")[0].classList.add('cor');
                $("svg-cont-steps").attributes.width.value = 80;
                $("svg-cont-steps").attributes.height.value = 160;
                $("svg-cont-clock").attributes.width.value = 80;
                $("svg-cont-clock").attributes.height.value = 160;
            }

            function addScript(url) {
                var e = document.createElement("script");
                e.src = url;
                e.type = "text/javascript";
                document.getElementsByTagName("head")[0].appendChild(e);
            }
            if (localStorage.appTheme == 'dark')
                wfe.app.changeTheme();
            if (!('lang' in localStorage))
                localStorage.lang = navigator.language || navigator.userLanguage;
            if (localStorage.lang.indexOf("ru") >= 0) {
                wfe.app.changeLang('russian');
            } else
            if (localStorage.lang.indexOf("zh") >= 0) {
                wfe.app.changeLang('chinese');
            } else
            if (localStorage.lang.indexOf("en") < 0 && localStorage.translatehelp != 1) {
                UIkit.notification("Please contact me if you can help me to translate this app to your language", {
                    status: 'primary',
                    pos: 'top-left',
                    timeout: 7500
                });
                localStorage.translatehelp = 1;
            }
            if (localStorage.showdemo != 0) {
                window.onload = function () {
                    if (localStorage.device == "cor") {
                        wfe.coords = JSON.parse('{"bg":{"Image":{"ImageIndex":293,"X":0,"Y":0}},"time":{"Hours":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":45,"Y":9},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":8,"Y":9}},"Minutes":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":45,"Y":84},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":8,"Y":83}}},"date":false,"battery":false,"status":false,"activity":false,"weather":false,"stepsprogress":false,"analog":false}');
                    } else
                        wfe.coords = JSON.parse('{"bg":{"Image":{"ImageIndex":265,"X":0,"Y":0}},"time":{"Hours":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":87,"Y":26},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":37,"Y":26}},"Minutes":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":112,"Y":77},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":62,"Y":77}}},"date":false,"battery":false,"status":false,"activity":false,"weather":false,"stepsprogress":false,"analog":false}');
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
            };
            localStorage.biptools = 0;
            if (localStorage.analogDescription)
                UIkit.alert($("analogDescription")).close();
            else
            UIkit.alert($("analogDescription"))._events[0] = function () {
                localStorage.analogDescription = true
            };
            for (var i = 200; i <= wfe.app.lastimage; i++)
                $("defimages").innerHTML += '<img src="defaultimages/' + i + '.png" id="' + i + '">';
            if (!('helpShown' in localStorage)) {
                UIkit.modal($("modal-howto")).show();
                localStorage.helpShown = true;
            }
            wfe.app.notWebkitBased = navigator.userAgent.search(/Edge/) > 0 || navigator.userAgent.search(/Firefox/) > 0 ? true : false;
            if (wfe.app.notWebkitBased) {
                UIkit.notification(('browserwarn' in wfe.app.lang ? wfe.app.lang.browserwarn : "Something may not work in your browser. WebKit-based browser recommended"), {
                    status: 'warning',
                    pos: 'top-left',
                    timeout: 7500
                });
                addScript("js/FileSaver.min.js");
                addScript("js/canvas-toBlob.js");
                $("inputblock").childNodes[3].childNodes[1].style.overflowX = "hidden";
            } else
            if (navigator.userAgent.match(/Android|iPhone/i))
                UIkit.notification(("This site is not optimized for mobile devices, something may not work"), {
                    status: 'warning',
                    pos: 'top-left',
                    timeout: 7500
                });
            $('inputimages').onchange = function () {
                if ($('inputimages').files.length) {
                    var i = 0;
                    console.log("Images count: ", $('inputimages').files.length);
                    while (i < $('inputimages').files.length) {
                        load.renderImage($('inputimages').files[i]);
                        i++;
                    }
                    wfe.data.imagesset = true;
                    if ($('inputimages').nextElementSibling.classList.contains("uk-button-danger")) {
                        $('inputimages').nextElementSibling.classList.remove("uk-button-danger");
                        $('inputimages').nextElementSibling.classList.add("uk-button-default");
                    }
                    $('inputimages').nextElementSibling.classList.add("uk-label-success");
                }
                if (wfe.data.imagesset && wfe.data.jsset)
                    load.disableBtn(1);
                else
                    load.disableBtn(0);
            }
            $('inputjs').onchange = function () {
                if ($('inputjs').files.length) {
                    wfe.data.wfname = $('inputjs').files[0].name.split(".")[0];
                    console.log("Watchface name: ", wfe.data.wfname);
                    document.title = "WF editor - " + wfe.data.wfname;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        try {
                            wfe.data.import(jsonlint.parse(e.target.result));
                        } catch (error) {
                            $("jsonerrortext").innerHTML = error;

                            function show() {
                                UIkit.modal($("jsonerrormodal")).show()
                            }
                            setTimeout(show, 200);
                            console.warn(error);
                        }
                    }
                    reader.readAsText($('inputjs').files[0]);
                    delete reader;
                    wfe.data.jsset = true;
                    if ($('inputjs').nextElementSibling.classList.contains("uk-button-danger")) {
                        $('inputjs').nextElementSibling.classList.remove("uk-button-danger");
                        $('inputjs').nextElementSibling.classList.add("uk-button-default");
                    }
                    $('inputjs').nextElementSibling.classList.add("uk-label-success");
                }
                if (wfe.data.imagesset && wfe.data.jsset)
                    load.disableBtn(1);
                else
                    load.disableBtn(0);
            }

            if (!('imagestabversion' in localStorage) || localStorage.imagestabversion < wfe.app.imagestabversion)
                $("imagesbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
            if (!('editortabversion' in localStorage) || localStorage.editortabversion < wfe.app.editortabversion)
                $("codeopenbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
            if (!('designtabversion' in localStorage) || localStorage.designtabversion < wfe.app.designtabversion)
                $("editbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
            if (!('analogtabversion' in localStorage) || localStorage.analogtabversion < wfe.app.analogtabversion)
                $("analogbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';

            UIkit.modal("#donateframe")._events[0] = function () {
                $("donateframe").innerHTML = '<iframe src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=Watchface%20editor&targets-hint=&default-sum=100&button-text=14&payment-type-choice=on&comment=on&hint=&successURL=&quickpay=shop&account=41001928688597" width="450" height="278" frameborder="0" allowtransparency="true" scrolling="no"></iframe>';
                $("donateframe").classList.remove('uk-modal');
            };
            UIkit.modal("#modal-about")._events[0] = function () {
                $("siteopened").innerHTML = $("siteopened").innerHTML.replace("$times", localStorage.showcount);
            }
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

            if (navigator.userAgent.indexOf("Electron") >= 0) {
                addScript('js/electronApp.js');
                wfe.app.local = false;
            }
            if (!wfe.app.local)
                setTimeout(addScript, 2000, 'js/metrika.js');
            else
                addScript('js/utilit.js');
        },
        coords: {},
        coordsHistory: []
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
                //UIkit.notification.closeAll()
                var t = 0;
                if (localStorage.device == 'cor') {
                    view.setPosN({
                        ImageIndex: 293,
                        X: 0,
                        Y: 0
                    }, 0, "wf_bg")
                } else
                    view.setPosN({
                        ImageIndex: 265,
                        X: 0,
                        Y: 0
                    }, 0, "wf_bg")
                if ('bg' in wfe.coords)
                    view.setPosN(wfe.coords.bg.Image, 0, "c_bg");
                if ('time' in wfe.coords)
                    draw.time.time();
                if ('seconds' in wfe.coords)
                    draw.time.seconds();
                if (wfe.coords.date) {
                    if ('weekday' in wfe.coords)
                        draw.date.weekday();
                    if ('dateday' in wfe.coords)
                        draw.date.sepday();
                    if ('datemonth' in wfe.coords)
                        draw.date.sepmonth();
                    if ('dateoneline' in wfe.coords)
                        draw.date.oneline();
                }
                if (wfe.coords.battery) {
                    if ('batteryicon' in wfe.coords)
                        draw.battery.icon();
                    if ('batterytext' in wfe.coords)
                        draw.battery.text();
                    if ('batteryscale' in wfe.coords)
                        draw.battery.scale();
                }
                if (wfe.coords.status) {
                    if ('statalarm' in wfe.coords)
                        draw.status.alarm();
                    if ('statbt' in wfe.coords)
                        draw.status.bt();
                    if ('statdnd' in wfe.coords)
                        draw.status.dnd();
                    if ('statlock' in wfe.coords)
                        draw.status.lock();
                }
                if (wfe.coords.activity) {
                    if ('actcal' in wfe.coords)
                        draw.activity.cal();
                    if ('actsteps' in wfe.coords)
                        draw.activity.steps();
                    if ('actstepsgoal' in wfe.coords)
                        draw.activity.stepsgoal();
                    if ('actpulse' in wfe.coords)
                        draw.activity.pulse();
                    if ('actdist' in wfe.coords)
                        draw.activity.distance();
                }
                if (wfe.coords.weather) {
                    if ('weathericon' in wfe.coords)
                        draw.weather.icon();
                    if ('weatheroneline' in wfe.coords)
                        draw.weather.temp.oneline();
                    if ('weatherday' in wfe.coords)
                        draw.weather.temp.sep.day();
                    if ('weathernight' in wfe.coords)
                        draw.weather.temp.sep.night();
                    if ('weathercur' in wfe.coords)
                        draw.weather.temp.current();
                    if ('weatherair' in wfe.coords)
                        draw.weather.air();
                }
                if (wfe.coords.stepsprogress) {
                    if ('stepscircle' in wfe.coords)
                        draw.stepsprogress.circle();
                    if ('stepslinear' in wfe.coords)
                        draw.stepsprogress.linear();
                    if ('stepsgoal' in wfe.coords && wfe.data.steps >= wfe.data.stepsgoal)
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
            } catch (error) {
                console.warn(error);
                if (error.name == "ImageError") {
                    UIkit.notification(('imagenotfound' in wfe.app.lang ? wfe.app.lang.imagenotfound : "Image with index $index not found").replace("$index", "<b>" + error.imageIndex + "</b>"), {
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
            switch (el.Alignment) {
                case 18:
                case "TopLeft":
                    block.reverse();
                    while (block.length) {
                        t = block.pop();
                        t.style.left = el.TopLeftX + offset + "px";
                        t.style.top = el.TopLeftY + "px";
                        view.insert(t, cls);
                        offset += t.width + el.Spacing;
                    }
                    break;
                case 24:
                case "TopCenter":
                    block.reverse();
                    offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
                    while (block.length) {
                        t = block.pop();
                        t.style.left = el.TopLeftX + offset + "px";
                        t.style.top = el.TopLeftY + "px";
                        view.insert(t, cls);
                        offset += t.width + el.Spacing;
                    }
                    break;
                case 20:
                case "TopRight":
                    while (block.length) {
                        t = block.pop();
                        t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                        t.style.top = el.TopLeftY + "px";
                        view.insert(t, cls);
                        offset += t.width + el.Spacing;
                    }
                    break;
                case 66:
                case "CenterLeft":
                    block.reverse();
                    var topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
                    while (block.length) {
                        t = block.pop();
                        t.style.left = el.TopLeftX + offset + "px";
                        t.style.top = el.TopLeftY + topoffset + "px";
                        view.insert(t, cls);
                        offset += t.width + el.Spacing;
                    }
                    break;
                case 72:
                case "Center":
                    block.reverse();
                    offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
                    var topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
                    while (block.length) {
                        t = block.pop();
                        t.style.left = el.TopLeftX + offset + "px";
                        t.style.top = el.TopLeftY + topoffset + "px";
                        view.insert(t, cls);
                        offset += t.width + el.Spacing;
                    }
                    break;
                case 68:
                case "CenterRight":
                    var topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
                    while (block.length) {
                        t = block.pop();
                        t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                        t.style.top = el.TopLeftY + topoffset + "px";
                        view.insert(t, cls);
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
                        view.insert(t, cls);
                        offset += t.width + el.Spacing;
                    }
                    break;
                case 40:
                case "BottomCenter":
                    block.reverse();
                    offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
                    while (block.length) {
                        t = block.pop();
                        t.style.left = el.TopLeftX + offset + "px";
                        t.style.top = el.BottomRightY - t.height + 1 + "px";
                        view.insert(t, cls);
                        offset += t.width + el.Spacing;
                    }
                    break;
                case 36:
                case "BottomRight":
                    while (block.length) {
                        t = block.pop();
                        t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                        t.style.top = el.BottomRightY - t.height + 1 + "px";
                        view.insert(t, cls);
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
                block: block,
                width: width
            }
        },
        time_change: function () {
            var t = $("in-time").value.split(":");
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
        date_change: function () {
            var t = $("in-date").valueAsDate;
            try {
                wfe.data.day = t.getDate();
                wfe.data.month = t.getMonth() + 1;
                wfe.data.weekDay = t.getDay() > 0 ? t.getDay() - 1 : 6;
                removeByClass("c_date_sepday");
                removeByClass("c_date_weekday");
                removeByClass("c_date_sepmonth");
                removeByClass("c_date_oneline");
                if (wfe.coords.date) {
                    if ('weekday' in wfe.coords)
                        draw.date.weekday();
                    if ('dateday' in wfe.coords)
                        draw.date.sepday();
                    if ('datemonth' in wfe.coords)
                        draw.date.sepmonth();
                    if ('dateoneline' in wfe.coords)
                        draw.date.oneline();
                }
            } catch (e) {
                console.warn(e);
            }
        },
        sec_change: function () {
            if ($("in-sec").value > 59) $("in-sec").value = 59;
            if ($("in-sec").value < 0) $("in-sec").value = 0;
            var sec = $("in-sec").value;
            wfe.data.seconds[0] = Number(sec.split("")[0]);
            wfe.data.seconds[1] = Number((sec.split("").length == 1 ? 0 : sec.split("")[1]));
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
        battery_change: function () {
            if ($("in-battery").value > 100) $("in-battery").value = 100;
            if ($("in-battery").value < 0) $("in-battery").value = 0;
            wfe.data.battery = $("in-battery").value;
            removeByClass("c_battery_icon");
            removeByClass("c_battery_scale");
            removeByClass("c_battery_text");
            if (wfe.coords.battery) {
                if ('batteryicon' in wfe.coords)
                    draw.battery.icon();
                if ('batterytext' in wfe.coords)
                    draw.battery.text();
                if ('batteryscale' in wfe.coords)
                    draw.battery.scale();
            }
        },
        alarm_change: function () {
            wfe.data.alarm = $("in-alarm").checked;
            removeByClass("c_stat_alarm");
            if (wfe.coords.status)
                if ('statalarm' in wfe.coords)
                    draw.status.alarm();
        },
        bt_change: function () {
            wfe.data.bluetooth = $("in-bt").checked;
            removeByClass("c_stat_bt");
            if (wfe.coords.status)
                if ('statbt' in wfe.coords)
                    draw.status.bt();

        },
        dnd_change: function () {
            wfe.data.dnd = $("in-dnd").checked;
            removeByClass("c_stat_dnd");
            if (wfe.coords.status)
                if ('statdnd' in wfe.coords)
                    draw.status.dnd();
        },
        lock_change: function () {
            wfe.data.lock = $("in-lock").checked;
            removeByClass("c_stat_lock");
            if (wfe.coords.status)
                if ('statlock' in wfe.coords)
                    draw.status.lock();
        },
        steps_change: function () {
            if ($("in-steps").value > 99999) $("in-steps").value = 99999;
            if ($("in-steps").value < 0) $("in-steps").value = 0;
            wfe.data.steps = $("in-steps").value;
            removeByClass("c_act_steps");
            if (wfe.coords.activity)
                if ('actsteps' in wfe.coords)
                    draw.activity.steps();
            removeByClass("c_steps_linear");
            removeByClass("c_steps_goal");
            $("svg-cont-steps").innerHTML = '';
            if (wfe.coords.stepsprogress) {
                if ('stepscircle' in wfe.coords)
                    draw.stepsprogress.circle();
                if ('stepslinear' in wfe.coords)
                    draw.stepsprogress.linear();
                if ('stepsgoal' in wfe.coords && wfe.data.steps >= wfe.data.stepsgoal)
                    draw.stepsprogress.goal();
            }
        },
        distance_change: function () {
            if ($("in-distance").value > 99) $("in-distance").value = 99;
            if ($("in-distance").value < 0) $("in-distance").value = 0;
            var dist = $("in-distance").value.split(".");
            wfe.data.distance[0] = Number(dist[0]);
            wfe.data.distance[1] = dist.length > 1 ? dist[1].slice(0, 2) : "00";
            removeByClass("c_act_distance");
            if (wfe.coords.activity)
                if ('actdist' in wfe.coords)
                    draw.activity.distance();
        },
        pulse_change: function () {
            if ($("in-pulse").value > 999) $("in-pulse").value = 999;
            if ($("in-pulse").value < 0) $("in-pulse").value = 0;
            wfe.data.pulse = $("in-pulse").value;
            removeByClass("c_act_pulse");
            if (wfe.coords.activity)
                if ('actpulse' in wfe.coords)
                    draw.activity.pulse();
        },
        calories_change: function () {
            if ($("in-calories").value > 9999) $("in-calories").value = 9999;
            if ($("in-calories").value < 0) $("in-calories").value = 0;
            wfe.data.calories = $("in-calories").value;
            removeByClass("c_act_cal");
            if (wfe.coords.activity)
                if ('actcal' in wfe.coords)
                    draw.activity.cal();
        },
        stepsgoal_change: function () {
            if ($("in-stepsgoal").value > 99999) $("in-stepsgoal").value = 99999;
            if ($("in-stepsgoal").value < 0) $("in-stepsgoal").value = 0;
            wfe.data.stepsgoal = $("in-stepsgoal").value;
            removeByClass("c_act_stepsgoal");
            if (wfe.coords.activity)
                if ('statstepsgoal' in wfe.coords)
                    draw.activity.stepsgoal();
            removeByClass("c_steps_linear");
            removeByClass("c_steps_goal");
            if (wfe.coords.stepsprogress) {
                if ('stepscircle' in wfe.coords)
                    draw.stepsprogress.circle();
                if ('stepslinear' in wfe.coords)
                    draw.stepsprogress.linear();
                if ('stepsgoal' in wfe.coords)
                    draw.stepsprogress.goal();
            }
        },
        weatherd_change: function () {
            if ($("in-weatherd").value > 99) $("in-weatherd").value = 99;
            if ($("in-weatherd").value < -99) $("in-weatherd").value = -99;
            wfe.data.temp[0] = $("in-weatherd").value;
            removeByClass("c_temp_sep_day");
            removeByClass("c_temp_cur");
            removeByClass("c_temp_oneline");
            if (wfe.coords.weather) {
                if ('weatheroneline' in wfe.coords)
                    draw.weather.temp.oneline();
                if ('weatherday' in wfe.coords)
                    draw.weather.temp.sep.day();
                if ('weathercur' in wfe.coords)
                    draw.weather.temp.current();
            }
        },
        weathern_change: function () {
            if ($("in-weathern").value > 99) $("in-weathern").value = 99;
            if ($("in-weathern").value < -99) $("in-weathern").value = -99;
            wfe.data.temp[1] = $("in-weathern").value;
            removeByClass("c_temp_sep_night");
            removeByClass("c_temp_oneline");
            if (wfe.coords.weather) {
                if ('weatheroneline' in wfe.coords)
                    draw.weather.temp.oneline();
                if ('weathernight' in wfe.coords)
                    draw.weather.temp.sep.night();
            }
        },
        weathericon_change: function () {
            if ($("in-weatheri").value > 26) $("in-weatheri").value = 26;
            if ($("in-weatheri").value < 1) $("in-weatheri").value = 1;
            wfe.data.weathericon = $("in-weatheri").value - 1;
            removeByClass("c_weather_icon");
            if (wfe.coords.weather)
                if (wfe.coords.weathericon)
                    draw.weather.icon();
        },
        makepng: function () {
            var el = 'watchfaceblock';
            if ($('makepngwithwatch').checked)
                el = 'watchfaceimage';
            html2canvas($(el), {
                onrendered: function (canvas) {
                    ctx = canvas.getContext('2d');
                    if (wfe.app.notWebkitBased) {
                        canvas.toBlob(function (blob) {
                            saveAs(blob, wfe.data.wfname + '.png');
                        });
                    } else {
                        var a = document.createElement('a');
                        a.href = canvas.toDataURL('image/png');
                        a.download = wfe.data.wfname + '.png';
                        a.click();
                        delete a;
                    }
                }
            });
        },
        makePreview: function () {
            html2canvas($('watchfaceimage'), {
                onrendered: function (canvas) {
                    $('realsizePreview').innerHTML = '';
                    $('realsizePreview').appendChild(canvas);
                }
            });
        }
    },
    load = {
        allinone: function () {
            wfe.data.import(JSON.parse('{"Background":{"Image":{"ImageIndex":265,"X":0,"Y":0}},"Time":{"DrawingOrder":"1234","Hours":{"Ones":{"ImageIndex":200,"ImagesCount":10,"X":9,"Y":0},"Tens":{"ImageIndex":200,"ImagesCount":10,"X":0,"Y":0}},"Minutes":{"Ones":{"ImageIndex":200,"ImagesCount":10,"X":29,"Y":0},"Tens":{"ImageIndex":200,"ImagesCount":10,"X":20,"Y":0}},"AmPm":{"X":41,"Y":11,"ImageIndexAm":233,"ImageIndexPm":234},"Seconds":{"Tens":{"X":41,"Y":0,"ImageIndex":200,"ImagesCount":10},"Ones":{"X":51,"Y":0,"ImageIndex":200,"ImagesCount":10}}},"Date":{"WeekDay":{"X":0,"Y":24,"ImageIndex":210,"ImagesCount":7},"MonthAndDay":{"Separate":{"Day":{"TopLeftX":0,"TopLeftY":11,"BottomRightX":15,"BottomRightY":20,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Month":{"TopLeftX":20,"TopLeftY":11,"BottomRightX":35,"BottomRightY":20,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10}},"TwoDigitsMonth":true,"TwoDigitsDay":true}},"Activity":{"Steps":{"TopLeftX":40,"TopLeftY":111,"BottomRightX":82,"BottomRightY":120,"Alignment":"TopRight","Spacing":2,"ImageIndex":200,"ImagesCount":10},"StepsGoal":{"TopLeftX":94,"TopLeftY":111,"BottomRightX":136,"BottomRightY":120,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Pulse":{"TopLeftX":43,"TopLeftY":148,"BottomRightX":67,"BottomRightY":157,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Calories":{"TopLeftX":2,"TopLeftY":148,"BottomRightX":35,"BottomRightY":157,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Distance":{"Number":{"TopLeftX":0,"TopLeftY":162,"BottomRightX":58,"BottomRightY":171,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"SuffixImageIndex":231,"DecimalPointImageIndex":232}},"StepsProgress":{"Linear":{"StartImageIndex":200,"Segments":[{"X":40,"Y":121},{"X":55,"Y":121},{"X":67,"Y":121},{"X":79,"Y":121},{"X":91,"Y":121},{"X":104,"Y":121},{"X":117,"Y":121},{"X":130,"Y":121}]},"Circle":{"CenterX":88,"CenterY":88,"RadiusX":24,"RadiusY":24,"StartAngle":0,"EndAngle":360,"Width":3,"Color":"0x00FF00"},"GoalImage":{"X":83,"Y":111,"ImageIndex":266}},"Status":{"Alarm":{"Coordinates":{"X":140,"Y":0},"ImageIndexOn":224},"Bluetooth":{"Coordinates":{"X":164,"Y":13},"ImageIndexOn":220,"ImageIndexOff":221},"Lock":{"Coordinates":{"X":166,"Y":0},"ImageIndexOn":223},"DoNotDisturb":{"Coordinates":{"X":153,"Y":0},"ImageIndexOn":222}},"Battery":{"Icon":{"X":116,"Y":0,"ImageIndex":225,"ImagesCount":6},"Text":{"TopLeftX":3,"TopLeftY":133,"BottomRightX":27,"BottomRightY":142,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Scale":{"StartImageIndex":200,"Segments":[{"X":90,"Y":64},{"X":104,"Y":73},{"X":100,"Y":93},{"X":80,"Y":106},{"X":65,"Y":95},{"X":63,"Y":76},{"X":69,"Y":64}]}},"Weather":{"Icon":{"CustomIcon":{"X":146,"Y":146,"ImageIndex":267,"ImagesCount":26}},"AirPollution":{"Icon":{"X":79,"Y":136,"ImageIndex":235,"ImagesCount":6}},"Temperature":{"Current":{"Number":{"TopLeftX":142,"TopLeftY":136,"BottomRightX":175,"BottomRightY":145,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218},"Today":{"Separate":{"Day":{"Number":{"TopLeftX":93,"TopLeftY":166,"BottomRightX":114,"BottomRightY":175,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218},"Night":{"Number":{"TopLeftX":93,"TopLeftY":153,"BottomRightX":114,"BottomRightY":162,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218}}}}},"AnalogDialFace":{"Hours":{"OnlyBorder":false,"Color":"0xFFFFFF","Center":{"X":88,"Y":88},"Shape":[{"X":-17,"Y":-2},{"X":54,"Y":-2},{"X":54,"Y":1},{"X":-17,"Y":1}]},"Minutes":{"OnlyBorder":false,"Color":"0xFFFFFF","Center":{"X":88,"Y":88},"Shape":[{"X":-17,"Y":-2},{"X":68,"Y":-2},{"X":68,"Y":1},{"X":-17,"Y":1}]},"Seconds":{"OnlyBorder":false,"Color":"0xFF0000","Center":{"X":88,"Y":88},"Shape":[{"X":-21,"Y":-1},{"X":82,"Y":-1},{"X":82,"Y":0},{"X":-21,"Y":0}],"CenterImage":{"X":84,"Y":84,"ImageIndex":200}}}}'));
            view.makeWf();
        },
        disableBtn: function (i) {
            if (i) {
                $("editbutton").classList.remove("uk-disabled");
                $("makepng").removeAttribute("disabled");
                $("viewsettings").removeAttribute("disabled");
                $("codeopenbutton").classList.remove("uk-disabled");
                $("imagesbutton").classList.remove("uk-disabled");
                $("analogbutton").classList.remove("uk-disabled");
                setTimeout(view.makeWf, 300);
            } else {
                $("editbutton").classList.add("uk-disabled");
                $("makepng").setAttribute("disabled", "");
                $("viewsettings").setAttribute("disabled", "");
                $("codeopenbutton").classList.add("uk-disabled");
                $("imagesbutton").classList.add("uk-disabled");
                $("analogbutton").classList.add("uk-disabled");
            }
        },
        clearjs: function () {
            $('inputjs').value = '';
            wfe.coords = {};
            wfe.data.jsset = false;
            if ($('inputjs').nextElementSibling.classList.contains("uk-label-success"))
                $('inputjs').nextElementSibling.classList.remove("uk-label-success");
            $('inputjs').nextElementSibling.classList.add("uk-button-danger");
            $('inputjs').nextElementSibling.classList.remove("uk-button-default");
            load.disableBtn(0);
        },
        clearimg: function () {
            $('inputimages').value = '';
            $('allimages').innerHTML = '';
            wfe.data.imagesset = false;
            if ($('inputimages').nextElementSibling.classList.contains("uk-label-success")) $('inputimages').nextElementSibling.classList.remove("uk-label-success");
            $('inputimages').nextElementSibling.classList.add("uk-button-danger");
            $('inputimages').nextElementSibling.classList.remove("uk-button-default");
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
                var ntimeOnClock = wfe.data.timeOnClock[0];
                if ('ampm' in wfe.coords) {
                    var am = 1;
                    if (Number(ntimeOnClock) > 12) {
                        ntimeOnClock = (Number(ntimeOnClock) - 12).toString();
                        if (ntimeOnClock.length == 1)
                            ntimeOnClock = "0" + ntimeOnClock;
                        am = 0;
                    }
                    t = am ? $c(wfe.coords.ampm.ImageIndexAm) : $c(wfe.coords.ampm.ImageIndexPm);
                    view.setPos(t, wfe.coords.ampm);
                    view.insert(t, "c_time_am");

                }
                view.setPosN(wfe.coords.time.Hours.Tens, Number(ntimeOnClock[0]), "c_time");
                view.setPosN(wfe.coords.time.Hours.Ones, Number(ntimeOnClock[1]), "c_time");
                view.setPosN(wfe.coords.time.Minutes.Tens, Number(wfe.data.timeOnClock[1][0]), "c_time");
                view.setPosN(wfe.coords.time.Minutes.Ones, Number(wfe.data.timeOnClock[1][1]), "c_time");
                if ('DrawingOrder' in wfe.coords.time) {
                    var time = document.getElementsByClassName("c_time");
                    time[0].style.zIndex = Number(wfe.coords.time.DrawingOrder[0]);
                    time[1].style.zIndex = Number(wfe.coords.time.DrawingOrder[1]);
                    time[2].style.zIndex = Number(wfe.coords.time.DrawingOrder[2]);
                    time[3].style.zIndex = Number(wfe.coords.time.DrawingOrder[3]);
                }
            },
            seconds: function () {
                view.setPosN(wfe.coords.seconds.Tens, wfe.data.seconds[0], "c_sec");
                view.setPosN(wfe.coords.seconds.Ones, wfe.data.seconds[1], "c_sec");
            }
        },
        date: {
            weekday: function () {
                view.setPosN(wfe.coords.weekday, wfe.data.weekDay, "c_date_weekday");
            },
            sepday: function () {
                var t = view.makeBlock(wfe.coords.dateday, wfe.data.day);
                if (wfe.coords.monthandday.TwoDigitsDay)
                    if (!div(wfe.data.day, 10)) {
                        t.block.splice(-1, 0, $c(wfe.coords.dateday.ImageIndex));
                        t.width += $(wfe.coords.dateday.ImageIndex).width + wfe.coords.dateday.Spacing;
                    }
                view.renderBlock(t.block, t.width, wfe.coords.dateday, "c_date_sepday");
            },
            sepmonth: function () {
                var t = view.makeBlock(wfe.coords.datemonth, wfe.data.month);
                if (wfe.coords.monthandday.TwoDigitsMonth)
                    if (!div(wfe.data.month, 10)) {
                        t.block.splice(-1, 0, $c(wfe.coords.datemonth.ImageIndex));
                        t.width += $(wfe.coords.datemonth.ImageIndex).width + wfe.coords.datemonth.Spacing;
                    }
                view.renderBlock(t.block, t.width, wfe.coords.datemonth, "c_date_sepmonth");
            },
            oneline: function () {
                var dot = $c(wfe.coords.dateoneline.DelimiterImageIndex);
                t = view.makeBlock(wfe.coords.dateoneline.Number, wfe.data.month);
                if (wfe.coords.monthandday.TwoDigitsMonth)
                    if (!div(wfe.data.month, 10)) {
                        t.block.splice(-1, 0, $c(wfe.coords.dateoneline.Number.ImageIndex));
                        t.width += $(wfe.coords.dateoneline.Number.ImageIndex).width + wfe.coords.dateoneline.Number.Spacing;
                    }
                t.block.push(dot);
                t.width += dot.width + wfe.coords.dateoneline.Number.Spacing;
                var t2 = view.makeBlock(wfe.coords.dateoneline.Number, wfe.data.day);
                t.block = t.block.concat(t2.block);
                if (wfe.coords.monthandday.TwoDigitsDay)
                    if (!div(wfe.data.day, 10)) {
                        t.block.splice(-1, 0, $c(wfe.coords.dateoneline.Number.ImageIndex));
                        t.width += $(wfe.coords.dateoneline.Number.ImageIndex).width + wfe.coords.dateoneline.Number.Spacing;
                    }
                t.width += t2.width;
                view.renderBlock(t.block, t.width, wfe.coords.dateoneline.Number, "c_date_oneline");
            }

        },
        battery: {
            icon: function () {
                var battery = Math.round(wfe.data.battery / (100 / (wfe.coords.batteryicon.ImagesCount - 1)));
                view.setPosN(wfe.coords.batteryicon, battery, "c_battery_icon");
            },
            text: function () {
                view.setTextPos(wfe.coords.batterytext, wfe.data.battery, "c_battery_text");
            },
            scale: function () {
                var end = Math.round(wfe.data.battery / (100 / (wfe.coords.batteryscale.Segments.length - 1)));
                for (var i = 0; i <= end; i++) {
                    t = $c(wfe.coords.batteryscale.StartImageIndex + i);
                    view.setPos(t, wfe.coords.batteryscale.Segments[i]);
                    view.insert(t, "c_battery_scale");
                }
            }
        },
        analog: {
            hours: function () {
                view.drawAnalog(wfe.coords.analoghours, wfe.data.analog[0]);
            },
            minutes: function () {
                view.drawAnalog(wfe.coords.analogminutes, wfe.data.analog[1]);
            },
            seconds: function () {
                view.drawAnalog(wfe.coords.analogseconds, wfe.data.analog[2]);
            }
        },
        status: {
            alarm: function () {
                if ('ImageIndexOff' in wfe.coords.statalarm && !wfe.data.alarm)
                    t = $c(wfe.coords.statalarm.ImageIndexOff);
                else if (wfe.data.alarm)
                    t = $c(wfe.coords.statalarm.ImageIndexOn);
                else return;
                t.style.left = wfe.coords.statalarm.Coordinates.X + "px";
                t.style.top = wfe.coords.statalarm.Coordinates.Y + "px";
                view.insert(t, "c_stat_alarm");
            },
            bt: function () {
                if ('ImageIndexOff' in wfe.coords.statbt && !wfe.data.bluetooth)
                    t = $c(wfe.coords.statbt.ImageIndexOff);
                else if ('ImageIndexOn' in wfe.coords.statbt && wfe.data.bluetooth)
                    t = $c(wfe.coords.statbt.ImageIndexOn);
                else return;
                t.style.left = wfe.coords.statbt.Coordinates.X + "px";
                t.style.top = wfe.coords.statbt.Coordinates.Y + "px";
                view.insert(t, "c_stat_bt");
            },
            dnd: function () {
                if ('ImageIndexOff' in wfe.coords.statdnd && !wfe.data.dnd)
                    t = $c(wfe.coords.statdnd.ImageIndexOff);
                else if (wfe.data.dnd)
                    t = $c(wfe.coords.statdnd.ImageIndexOn);
                else return;
                t.style.left = wfe.coords.statdnd.Coordinates.X + "px";
                t.style.top = wfe.coords.statdnd.Coordinates.Y + "px";
                view.insert(t, "c_stat_dnd");
            },
            lock: function () {
                if ('ImageIndexOff' in wfe.coords.statlock && !wfe.data.lock)
                    t = $c(wfe.coords.statlock.ImageIndexOff);
                else if (wfe.data.lock)
                    t = $c(wfe.coords.statlock.ImageIndexOn);
                else return;
                t.style.left = wfe.coords.statlock.Coordinates.X + "px";
                t.style.top = wfe.coords.statlock.Coordinates.Y + "px";
                view.insert(t, "c_stat_lock");
            }
        },
        activity: {
            cal: function () {
                view.setTextPos(wfe.coords.actcal, wfe.data.calories, "c_act_cal");
            },
            steps: function () {
                view.setTextPos(wfe.coords.actsteps, wfe.data.steps, "c_act_steps");
            },
            stepsgoal: function () {
                view.setTextPos(wfe.coords.actstepsgoal, wfe.data.stepsgoal, "c_act_stepsg");
            },
            pulse: function () {
                view.setTextPos(wfe.coords.actpulse, wfe.data.pulse, "c_act_pulse");
            },
            distance: function () {
                var dot = $c(wfe.coords.actdist.DecimalPointImageIndex),
                    km = $c(wfe.coords.actdist.SuffixImageIndex);
                t = view.makeBlock(wfe.coords.actdist.Number, wfe.data.distance[0]);
                t.block.push(dot);
                t.width += dot.width + wfe.coords.actdist.Number.Spacing;
                var t2 = view.makeBlock(wfe.coords.actdist.Number, wfe.data.distance[1]);
                t.block = t.block.concat(t2.block);
                t.width += t2.width;
                t.block.push(km);
                t.width += km.width;
                view.renderBlock(t.block, t.width, wfe.coords.actdist.Number, "c_act_distance");
            }
        },
        stepsprogress: {
            circle: function () {
                var col = wfe.coords.stepscircle.Color.replace("0x", "#"),
                    full = Math.floor(2 * wfe.coords.stepscircle.RadiusX * Math.PI / 360 * (wfe.coords.stepscircle.EndAngle - wfe.coords.stepscircle.StartAngle));
                var fill = Math.round(wfe.data.steps / (wfe.data.stepsgoal / full));
                if (fill > full) fill = full;
                $('svg-cont-steps').innerHTML += "<ellipse transform=\"rotate(" + (-90 + wfe.coords.stepscircle.StartAngle) + " " + wfe.coords.stepscircle.CenterX + " " + wfe.coords.stepscircle.CenterY + ")\" cx=\"" + wfe.coords.stepscircle.CenterX + "\" cy=\"" + wfe.coords.stepscircle.CenterY + "\" rx=\"" + wfe.coords.stepscircle.RadiusX + "\" ry=\"" + wfe.coords.stepscircle.RadiusY + "\" fill=\"rgba(255,255,255,0)\" stroke-width=\"" + wfe.coords.stepscircle.Width + "\" stroke=\"" + col + "\" stroke-dasharray=\"" + fill + " " + (full - fill) + "\" stroke-linecap=\"none\"></ellipse>";
            },
            linear: function () {
                var end = Math.round(wfe.data.steps / (wfe.data.stepsgoal / (wfe.coords.stepslinear.Segments.length))) - 1;
                if (end > wfe.coords.stepslinear.Segments.length - 1)
                    end = wfe.coords.stepslinear.Segments.length - 1;
                for (var i = 0; i <= end; i++) {
                    t = $c(wfe.coords.stepslinear.StartImageIndex + i);
                    view.setPos(t, wfe.coords.stepslinear.Segments[i]);
                    view.insert(t, "c_steps_linear");
                }
            },
            goal: function () {
                if (wfe.data.steps >= wfe.data.stepsgoal)
                    view.setPosN(wfe.coords.stepsgoal, 0, "c_steps_goal");
            }
        },
        weather: {
            icon: function () {
                if ('CustomIcon' in wfe.coords.weathericon) {
                    t = $c(wfe.coords.weathericon.CustomIcon.ImageIndex + wfe.data.weathericon);
                    t.style.left = wfe.coords.weathericon.CustomIcon.X + "px";
                    t.style.top = wfe.coords.weathericon.CustomIcon.Y + "px";
                    view.insert(t, "c_weather_icon");
                } else {
                    t = $c("weather");
                    t.style.left = wfe.coords.weathericon.Coordinates.X + "px";
                    t.style.top = wfe.coords.weathericon.Coordinates.Y + "px";
                    view.insert(t, "c_weather_icon");
                }
            },
            temp: {
                oneline: function () {
                    var sep = $c(wfe.coords.weatheroneline.DelimiterImageIndex),
                        deg = $c(wfe.coords.weatheroneline.DegreesImageIndex),
                        minus = wfe.data.temp[0] < 0 ? $c(wfe.coords.weatheroneline.MinusSignImageIndex) : 0;
                    t = view.makeBlock(wfe.coords.weatheroneline.Number, Math.abs(wfe.data.temp[0]));
                    if (minus != 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    t.block.push(sep);
                    t.width += sep.width + wfe.coords.weatheroneline.Number.Spacing;
                    var t2 = view.makeBlock(wfe.coords.weatheroneline.Number, Math.abs(wfe.data.temp[1]));
                    minus = wfe.data.temp[1] < 0 ? $c(wfe.coords.weatheroneline.MinusSignImageIndex) : 0;
                    if (minus != 0) {
                        t2.block.splice(0, 0, minus);
                        t2.width += minus.width;
                    }
                    t.block = t.block.concat(t2.block);
                    t.width += t2.width;
                    t.block.push(deg);
                    t.width += deg.width;
                    view.renderBlock(t.block, t.width, wfe.coords.weatheroneline.Number, "c_temp_oneline");
                },
                sep: {
                    day: function () {
                        var minus = wfe.data.temp[0] < 0 ? $c(wfe.coords.weatherday.MinusImageIndex) : 0;
                        t = view.makeBlock(wfe.coords.weatherday.Number, Math.abs(wfe.data.temp[0]));
                        if ('DegreesImageIndex' in wfe.coords.weatherday) {
                            var deg = $c(wfe.coords.weatherday.DegreesImageIndex);
                            t.block.push(deg);
                            t.width += deg.width + wfe.coords.weatherday.Number.Spacing;
                        }
                        if (minus != 0) {
                            t.block.splice(0, 0, minus);
                            t.width += minus.width;
                        }
                        view.renderBlock(t.block, t.width, wfe.coords.weatherday.Number, "c_temp_sep_day");
                    },
                    night: function () {
                        var minus = wfe.data.temp[1] < 0 ? $c(wfe.coords.weathernight.MinusImageIndex) : 0;
                        t = view.makeBlock(wfe.coords.weathernight.Number, Math.abs(wfe.data.temp[1]));
                        if ('DegreesImageIndex' in wfe.coords.weathernight) {
                            var deg = $c(wfe.coords.weathernight.DegreesImageIndex);
                            t.block.push(deg);
                            t.width += deg.width + wfe.coords.weathernight.Number.Spacing;
                        }
                        if (minus != 0) {
                            t.block.splice(0, 0, minus);
                            t.width += minus.width;
                        }
                        view.renderBlock(t.block, t.width, wfe.coords.weathernight.Number, "c_temp_sep_night");
                    }
                },
                current: function () {
                    var minus = wfe.data.temp[0] < 0 ? $c(wfe.coords.weathercur.MinusImageIndex) : 0;
                    t = view.makeBlock(wfe.coords.weathercur.Number, Math.abs(wfe.data.temp[0]));
                    if ('DegreesImageIndex' in wfe.coords.weathercur) {
                        var deg = $c(wfe.coords.weathercur.DegreesImageIndex);
                        t.block.push(deg);
                        t.width += deg.width + wfe.coords.weathercur.Number.Spacing;
                    }
                    if (minus != 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    view.renderBlock(t.block, t.width, wfe.coords.weathercur.Number, "c_temp_cur");
                }
            },
            air: function () {
                view.setPosN(wfe.coords.weatherair.Icon, 0, "c_air");
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
            if (!('designtabversion' in localStorage) || localStorage.designtabversion < wfe.app.designtabversion)
                localStorage.designtabversion = wfe.app.designtabversion;
            $("editor").innerHTML = '';
            if ('bg' in wfe.coords) {
                var bg = $c(wfe.coords.bg.Image.ImageIndex);
                bg.style.left = wfe.coords.bg.Image.X * 3 + "px";
                bg.style.top = wfe.coords.bg.Image.Y * 3 + "px";
                bg.style.position = "absolute";
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
            if ('time' in wfe.coords) {
                editor.makeImg(wfe.coords.time.Hours.Tens, "e_time_ht");
                editor.makeImg(wfe.coords.time.Hours.Ones, "e_time_ho");
                editor.makeImg(wfe.coords.time.Minutes.Tens, "e_time_mt");
                editor.makeImg(wfe.coords.time.Minutes.Ones, "e_time_mo");
                setTimeout(function () {
                    editor.initdrag('e_time_ht', wfe.coords.time.Hours.Tens, "c_time", draw.time.time);
                    editor.initdrag('e_time_ho', wfe.coords.time.Hours.Ones, "c_time", draw.time.time);
                    editor.initdrag('e_time_mt', wfe.coords.time.Minutes.Tens, "c_time", draw.time.time);
                    editor.initdrag('e_time_mo', wfe.coords.time.Minutes.Ones, "c_time", draw.time.time);
                }, 10);
                if ('seconds' in wfe.coords) {
                    editor.makeImg(wfe.coords.seconds.Tens, "e_time_st");
                    editor.makeImg(wfe.coords.seconds.Ones, "e_time_so");
                    setTimeout(function () {
                        editor.initdrag('e_time_st', wfe.coords.seconds.Tens, "c_sec", draw.time.seconds);
                        editor.initdrag('e_time_so', wfe.coords.seconds.Ones, "c_sec", draw.time.seconds);
                    }, 10);
                }
                if ('ampm' in wfe.coords) {
                    $("editor").innerHTML +=
                        '<div id="e_time_am" style="height:' + ($(wfe.coords.ampm.ImageIndexAm).height * 3) + 'px; width:' + ($(wfe.coords.ampm.ImageIndexAm).width * 3) + 'px; top:' + (wfe.coords.ampm.Y * 3) + 'px; left:' + (wfe.coords.ampm.X * 3) + 'px;" class="editor-elem"></div>';
                    setTimeout(function () {
                        editor.initdrag('e_time_am', wfe.coords.ampm, "c_time_am", draw.time.time);
                    }, 10);
                }
            }
            if (wfe.coords.date) {
                if ('weekday' in wfe.coords) {
                    editor.makeImg(wfe.coords.weekday, "e_date_weekday");
                    setTimeout(function () {
                        editor.initdrag('e_date_weekday', wfe.coords.weekday, "c_date_weekday", draw.date.weekday);
                    }, 10);
                }
                if ('dateday' in wfe.coords) {
                    editor.makeBlock(wfe.coords.dateday, "e_date_sep_day");
                    setTimeout(function () {
                        editor.initdrag('e_date_sep_day', wfe.coords.dateday, "c_date_sepday", draw.date.sepday);
                    }, 10);
                }
                if ('datemonth' in wfe.coords) {
                    editor.makeBlock(wfe.coords.datemonth, "e_date_sep_month");
                    setTimeout(function () {
                        editor.initdrag('e_date_sep_month', wfe.coords.datemonth, "c_date_sepmonth", draw.date.sepmonth);
                    }, 10);
                }
                if ('dateoneline' in wfe.coords) {
                    editor.makeBlock(wfe.coords.dateoneline.Number, "e_date_oneline");
                    setTimeout(function () {
                        editor.initdrag('e_date_oneline', wfe.coords.dateoneline.Number, "c_date_oneline", draw.date.oneline);
                    }, 10);
                }
            }
            if (wfe.coords.activity) {
                if ('actcal' in wfe.coords) {
                    editor.makeBlock(wfe.coords.actcal, "e_act_cal");
                    setTimeout(function () {
                        editor.initdrag('e_act_cal', wfe.coords.actcal, "c_act_cal", draw.activity.cal);
                    }, 10);
                }
                if ('actsteps' in wfe.coords) {
                    editor.makeBlock(wfe.coords.actsteps, "e_act_steps");
                    setTimeout(function () {
                        editor.initdrag('e_act_steps', wfe.coords.actsteps, "c_act_steps", draw.activity.steps);
                    }, 10);
                }
                if ('actstepsgoal' in wfe.coords) {
                    editor.makeBlock(wfe.coords.actstepsgoal, "e_act_stepsgoal");
                    setTimeout(function () {
                        editor.initdrag('e_act_stepsgoal', wfe.coords.actstepsgoal, "c_act_stepsg", draw.activity.stepsgoal);
                    }, 10);
                }
                if ('actpulse' in wfe.coords) {
                    editor.makeBlock(wfe.coords.actpulse, "e_act_pulse");
                    setTimeout(function () {
                        editor.initdrag('e_act_pulse', wfe.coords.actpulse, "c_act_pulse", draw.activity.pulse);
                    }, 10);
                }
                if ('actdist' in wfe.coords) {
                    editor.makeBlock(wfe.coords.actdist.Number, "e_act_distance");
                    setTimeout(function () {
                        editor.initdrag('e_act_distance', wfe.coords.actdist.Number, "c_act_distance", draw.activity.distance);
                    }, 10);
                }
            }
            if (wfe.coords.battery) {
                if ('batteryicon' in wfe.coords) {
                    editor.makeImg(wfe.coords.batteryicon, "e_battery_icon");
                    setTimeout(function () {
                        editor.initdrag('e_battery_icon', wfe.coords.batteryicon, "c_battery_icon", draw.battery.icon);
                    }, 10);
                }
                if ('batterytext' in wfe.coords) {
                    editor.makeBlock(wfe.coords.batterytext, "e_battery_text");
                    setTimeout(function () {
                        editor.initdrag('e_battery_text', wfe.coords.batterytext, "c_battery_text", draw.battery.text);
                    }, 10);
                }
                if ('batteryscale' in wfe.coords) {
                    for (var i = 0; i < wfe.coords.batteryscale.Segments.length; i++) {
                        $("editor").innerHTML +=
                            '<div id="e_battery_linar_' + i + '" style="height:' + ($(wfe.coords.batteryscale.StartImageIndex + i).height * 3) + 'px; width:' + ($(wfe.coords.batteryscale.StartImageIndex + i).width * 3) + 'px; top:' + (wfe.coords.batteryscale.Segments[i].Y * 3) + 'px; left:' + (wfe.coords.batteryscale.Segments[i].X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function (i) {
                            editor.initdrag(('e_battery_linar_' + i), wfe.coords.batteryscale.Segments[i], "c_battery_scale", draw.battery.scale);
                        }, 10, i);
                    }
                }
            }
            if (wfe.coords.status) {
                if ('statalarm' in wfe.coords) {
                    editor.makeImgStat(wfe.coords.statalarm, "e_stat_alarm");
                    setTimeout(function () {
                        editor.initdrag('e_stat_alarm', wfe.coords.statalarm.Coordinates, "c_stat_alarm", draw.status.alarm);
                    }, 10);
                }
                if ('statbt' in wfe.coords) {
                    editor.makeImgStat(wfe.coords.statbt, "e_stat_bt");
                    setTimeout(function () {
                        editor.initdrag('e_stat_bt', wfe.coords.statbt.Coordinates, "c_stat_bt", draw.status.bt);
                    }, 10);
                }
                if ('statdnd' in wfe.coords) {
                    editor.makeImgStat(wfe.coords.statdnd, "e_stat_dnd");
                    setTimeout(function () {
                        editor.initdrag('e_stat_dnd', wfe.coords.statdnd.Coordinates, "c_stat_dnd", draw.status.dnd);
                    }, 10);
                }
                if ('statlock' in wfe.coords) {
                    editor.makeImgStat(wfe.coords.statlock, "e_stat_lock");
                    setTimeout(function () {
                        editor.initdrag('e_stat_lock', wfe.coords.statlock.Coordinates, "c_stat_lock", draw.status.lock);
                    }, 10);
                }
            }
            if (wfe.coords.weather) {
                if ('weathericon' in wfe.coords)
                    if ('CustomIcon' in wfe.coords.weathericon) {
                        $("editor").innerHTML +=
                            '<div id="e_weather_icon" style="height:' + ($(wfe.coords.weathericon.CustomIcon.ImageIndex).height * 3) + 'px; width:' + ($(wfe.coords.weathericon.CustomIcon.ImageIndex).width * 3) + 'px; top:' + (wfe.coords.weathericon.CustomIcon.Y * 3) + 'px; left:' + (wfe.coords.weathericon.CustomIcon.X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function () {
                            editor.initdrag('e_weather_icon', wfe.coords.weathericon.CustomIcon, "c_weather_icon", draw.weather.icon);
                        }, 10);
                    } else {
                        $("editor").innerHTML +=
                            '<div id="e_weather_icon" style="height:' + ($("weather").height * 3) + 'px; width:' + ($("weather").width * 3) + 'px; top:' + (wfe.coords.weathericon.Coordinates.Y * 3) + 'px; left:' + (wfe.coords.weathericon.Coordinates.X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function () {
                            editor.initdrag('e_weather_icon', wfe.coords.weathericon.Coordinates, "c_weather_icon", draw.weather.icon);
                        }, 10);
                    }
                if ('weatheroneline' in wfe.coords) {
                    editor.makeBlock(wfe.coords.weatheroneline.Number, "e_weather_temp_today_oneline");
                    setTimeout(function () {
                        editor.initdrag('e_weather_temp_today_oneline', wfe.coords.weatheroneline.Number, "c_temp_oneline", draw.weather.temp.oneline);
                    }, 10);
                }
                if ('weatherday' in wfe.coords) {
                    editor.makeBlock(wfe.coords.weatherday.Number, "e_weather_temp_today_sep_day");
                    setTimeout(function () {
                        editor.initdrag('e_weather_temp_today_sep_day', wfe.coords.weatherday.Number, "c_temp_sep_day", draw.weather.temp.sep.day);
                    }, 10);
                }
                if ('weathernight' in wfe.coords) {
                    editor.makeBlock(wfe.coords.weathernight.Number, "e_weather_temp_today_sep_night");
                    setTimeout(function () {
                        editor.initdrag('e_weather_temp_today_sep_night', wfe.coords.weathernight.Number, "c_temp_sep_night", draw.weather.temp.sep.night);
                    }, 10);
                }
                if ('weathercur' in wfe.coords) {
                    editor.makeBlock(wfe.coords.weathercur.Number, "e_weather_temp_current");
                    setTimeout(function () {
                        editor.initdrag('e_weather_temp_current', wfe.coords.weathercur.Number, "c_temp_cur", draw.weather.temp.current);
                    }, 10);
                }
                if ('weatherair' in wfe.coords) {
                    editor.makeImg(wfe.coords.weatherair.Icon, "e_weather_air");
                    setTimeout(function () {
                        editor.initdrag('e_weather_air', wfe.coords.weatherair.Icon, "c_air", draw.weather.air);
                    }, 10);
                }
            }
            if (wfe.coords.stepsprogress) {
                if ('stepscircle' in wfe.coords) {}
                if ('stepslinear' in wfe.coords) {
                    for (var i = 0; i < wfe.coords.stepslinear.Segments.length; i++) {
                        $("editor").innerHTML +=
                            '<div id="e_steps_linar_' + i + '" style="height:' + ($(wfe.coords.stepslinear.StartImageIndex + i).height * 3) + 'px; width:' + ($(wfe.coords.stepslinear.StartImageIndex + i).width * 3) + 'px; top:' + (wfe.coords.stepslinear.Segments[i].Y * 3) + 'px; left:' + (wfe.coords.stepslinear.Segments[i].X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function (i) {
                            editor.initdrag(('e_steps_linar_' + i), wfe.coords.stepslinear.Segments[i], "c_steps_linear", draw.stepsprogress.linear);
                        }, 10, i);
                    }
                }
                if ('stepsgoal' in wfe.coords) {
                    editor.makeImg(wfe.coords.stepsgoal, "e_steps_goal");
                    setTimeout(function () {
                        editor.initdrag('e_steps_goal', wfe.coords.stepsgoal, "c_steps_goal", draw.stepsprogress.goal);
                    }, 10);
                }
            }
        },
        initdrag: function (el, elcoords, cls, drawF) {
            el = $(el);
            el.onmousedown = function (e) {
                wfe.coordsHistory.push(JSON.stringify(wfe.coords));
                var ed = editor.getOffsetRect($("editor"));
                var curcoords = getCoords(el);
                var shiftX = e.pageX - curcoords.left;
                var shiftY = e.pageY - curcoords.top;

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
                    $("e_coords").innerHTML = ('coordinates' in wfe.app.lang ? wfe.app.lang.coordinates : "Coordinates");
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
            if (wfe.coords.date) {
                if ('dateday' in wfe.coords)
                    editor.calc(wfe.coords.dateday, 2);
                if ('datemonth' in wfe.coords)
                    editor.calc(wfe.coords.datemonth, 2);
                if ('dateoneline' in wfe.coords)
                    editor.calc(wfe.coords.dateoneline.Number, 4, wfe.coords.dateoneline.DelimiterImageIndex);
            }
            if ('batterytext' in wfe.coords)
                editor.calc(wfe.coords.batterytext, 3);
            if (wfe.coords.activity) {
                if ('actcal' in wfe.coords)
                    editor.calc(wfe.coords.actcal, 4);
                if ('actsteps' in wfe.coords)
                    editor.calc(wfe.coords.actsteps, 5);
                if ('actstepsgoal' in wfe.coords)
                    editor.calc(wfe.coords.actstepsgoal, 5);
                if ('actpulse' in wfe.coords)
                    editor.calc(wfe.coords.actpulse, 3);
                if ('actdist' in wfe.coords)
                    editor.calc(wfe.coords.actdist.Number, 4, wfe.coords.actdist.DecimalPointImageIndex, wfe.coords.actdist.SuffixImageIndex);
            }
            if (wfe.coords.weather) {
                if ('weatheroneline' in wfe.coords)
                    editor.calc(wfe.coords.weatheroneline.Number, 4, wfe.coords.weatheroneline.MinusSignImageIndex, wfe.coords.weatheroneline.MinusSignImageIndex, wfe.coords.weatheroneline.DelimiterImageIndex, wfe.coords.weatheroneline.DegreesImageIndex);
                if ('weatherday' in wfe.coords)
                    editor.calc(wfe.coords.weatherday.Number, 2, wfe.coords.weatherday.MinusImageIndex, wfe.coords.weatherday.DegreesImageIndex);
                if ('weathernight' in wfe.coords)
                    editor.calc(wfe.coords.weathernight.Number, 2, wfe.coords.weathernight.MinusImageIndex, wfe.coords.weathernight.DegreesImageIndex);
                if ('weathercur' in wfe.coords)
                    editor.calc(wfe.coords.weathercur.Number, 2, wfe.coords.weathercur.MinusImageIndex, wfe.coords.weathercur.DegreesImageIndex);
            }
            editor.init();
            view.makeWf();
        },
        undo: function () {
            if (wfe.coordsHistory.length) {
                wfe.coords = JSON.parse(wfe.coordsHistory.pop());
                editor.init();
                view.makeWf();
            }
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
            $("codearea").innerHTML = jsoneditor.syntaxHighlight(JSON.stringify(wfe.data.export(), null, 4));
            if ($("codearea").innerText.match(jsoneditor.regexrimg))
                $("defaultimages").classList.add("uk-label-success");
            else
                $("defaultimages").classList.remove("uk-label-success");
            view.makeWf();
            if ('time' in wfe.coords) {
                if ('seconds' in wfe.coords)
                    jsoneditor.togglebutton("tgsec", 1);
                else
                    jsoneditor.togglebutton("tgsec", 0);
                if ('ampm' in wfe.coords)
                    jsoneditor.togglebutton("tg12/24", 1);
                else
                    jsoneditor.togglebutton("tg12/24", 0);
            }
            if ('weekday' in wfe.coords)
                jsoneditor.togglebutton("tgweekday", 1);
            else
                jsoneditor.togglebutton("tgweekday", 0);
            if ('dateday' in wfe.coords)
                jsoneditor.togglebutton("tgdateday", 1);
            else
                jsoneditor.togglebutton("tgdateday", 0);
            if ('datemonth' in wfe.coords)
                jsoneditor.togglebutton("tgdatemonth", 1);
            else
                jsoneditor.togglebutton("tgdatemonth", 0);
            if ('dateoneline' in wfe.coords)
                jsoneditor.togglebutton("tgdateoneline", 1);
            else
                jsoneditor.togglebutton("tgdateoneline", 0);
            if ('batteryicon' in wfe.coords)
                jsoneditor.togglebutton("tgbaticon", 1);
            else
                jsoneditor.togglebutton("tgbaticon", 0);
            if ('batterytext' in wfe.coords)
                jsoneditor.togglebutton("tgbatnum", 1);
            else
                jsoneditor.togglebutton("tgbatnum", 0);
            if ('batteryscale' in wfe.coords)
                jsoneditor.togglebutton("tgbatscale", 1);
            else
                jsoneditor.togglebutton("tgbatscale", 0);
            if ('statalarm' in wfe.coords)
                jsoneditor.togglebutton("tgstatalarm", 1);
            else
                jsoneditor.togglebutton("tgstatalarm", 0);
            if ('statbt' in wfe.coords)
                jsoneditor.togglebutton("tgstatbt", 1);
            else
                jsoneditor.togglebutton("tgstatbt", 0);
            if ('statdnd' in wfe.coords)
                jsoneditor.togglebutton("tgstatdnd", 1);
            else
                jsoneditor.togglebutton("tgstatdnd", 0);
            if ('statlock' in wfe.coords)
                jsoneditor.togglebutton("tgstatlock", 1);
            else
                jsoneditor.togglebutton("tgstatlock", 0);
            if ('actcal' in wfe.coords)
                jsoneditor.togglebutton("tgactcalories", 1);
            else
                jsoneditor.togglebutton("tgactcalories", 0);
            if ('actsteps' in wfe.coords)
                jsoneditor.togglebutton("tgactsteps", 1);
            else
                jsoneditor.togglebutton("tgactsteps", 0);
            if ('actstepsgoal' in wfe.coords)
                jsoneditor.togglebutton("tgactstepsgoal", 1);
            else
                jsoneditor.togglebutton("tgactstepsgoal", 0);
            if ('actpulse' in wfe.coords)
                jsoneditor.togglebutton("tgactpulse", 1);
            else
                jsoneditor.togglebutton("tgactpulse", 0);
            if ('actdist' in wfe.coords)
                jsoneditor.togglebutton("tgactdist", 1);
            else
                jsoneditor.togglebutton("tgactdist", 0);
            if (wfe.coords.weather) {
                if (wfe.coords.weathericon)
                    if ('CustomIcon' in wfe.coords.weathericon) {
                        jsoneditor.togglebutton("tgweathercusticon", 1);
                        jsoneditor.togglebutton("tgweathericon", 0);
                    } else {
                        jsoneditor.togglebutton("tgweathericon", 1);
                        jsoneditor.togglebutton("tgweathercusticon", 0);
                    }
                else {
                    jsoneditor.togglebutton("tgweathericon", 0);
                    jsoneditor.togglebutton("tgweathercusticon", 0);
                }
                if ('weatheroneline' in wfe.coords)
                    jsoneditor.togglebutton("tgweatheroneline", 1);
                else
                    jsoneditor.togglebutton("tgweatheroneline", 0);
                if ('weatherday' in wfe.coords)
                    jsoneditor.togglebutton("tgweatherday", 1);
                else
                    jsoneditor.togglebutton("tgweatherday", 0);
                if ('weathernight' in wfe.coords)
                    jsoneditor.togglebutton("tgweathernight", 1);
                else
                    jsoneditor.togglebutton("tgweathernight", 0);

                if ('weathercur' in wfe.coords)
                    jsoneditor.togglebutton("tgweathercur", 1);
                else
                    jsoneditor.togglebutton("tgweathercur", 0);
                if ('weatherair' in wfe.coords)
                    jsoneditor.togglebutton("tgweatherair", 1);
                else
                    jsoneditor.togglebutton("tgweatherair", 0);
            } else {
                jsoneditor.togglebutton("tgweathericon", 0);
                jsoneditor.togglebutton("tgweathercusticon", 0);
                jsoneditor.togglebutton("tgweatheroneline", 0);
                jsoneditor.togglebutton("tgweatherday", 0);
                jsoneditor.togglebutton("tgweathernight", 0);
                jsoneditor.togglebutton("tgweathercur", 0);
                jsoneditor.togglebutton("tgweatherair", 0);
            }
            if (wfe.coords.stepsprogress) {
                if ('stepslinear' in wfe.coords)
                    jsoneditor.togglebutton("tgstepslinear", 1);
                else
                    jsoneditor.togglebutton("tgstepslinear", 0);
                if ('stepsgoal' in wfe.coords)
                    jsoneditor.togglebutton("tgactgoalicon", 1);
                else
                    jsoneditor.togglebutton("tgactgoalicon", 0);
            } else {
                jsoneditor.togglebutton("tgstepslinear", 0);
                jsoneditor.togglebutton("tgactgoalicon", 0);
            }
        },
        toggleElements: {
            amPm: '"AmPm":',
            seconds: '"Seconds":',
            weekDay: '"WeekDay":',
            dateOneLine: '"MonthAndDay":',
            dateDay: '"MonthAndDay":',
            dateMonth: '"Month":',
            statAlarm: '"Alarm":',
            statBt: '"Bluetooth":',
            statLock: '"Lock":',
            statDnd: '"DoNotDisturb":',
            actSteps: '"Steps":',
            actStepsGoal: '"StepsGoal":',
            actCal: '"Calories":',
            actDistance: '"Distance":',
            actPulse: '"Pulse":',
            batteryIcon: '"Battery":',
            batteryText: '"Battery":',
            batteryScale: '"Battery":',
            weatherIcon: '"Weather":',
            weatherIconCustom: '"CustomIcon":',
            weatherAir: '"AirPollution":',
            weatherOneLine: '"Temperature":',
            weatherCurrent: '"Current":',
            weatherDay: '"Temperature":',
            weatherNight: '"Night":',
            stepsGoal: '"GoalImage":',
            stepsLinear: '"Linear":'
        },
        toggle: function (el) {
            switch (el) {
                case 'amPm':
                    {
                        if ('ampm' in wfe.coords) {
                            delete wfe.coords.ampm;
                        } else {
                            wfe.coords.ampm = {
                                X: 0,
                                Y: 0,
                                ImageIndexAm: 233,
                                ImageIndexPm: 234
                            }
                        }
                        break;
                    }
                case 'seconds':
                    {
                        if ('seconds' in wfe.coords) {
                            delete wfe.coords.seconds;
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
                case 'weekDay':
                    {
                        if ('weekday' in wfe.coords) {
                            delete wfe.coords.weekday;
                            if (!('monthandday' in wfe.coords))
                                wfe.coords.date = false;
                        } else {
                            wfe.coords.date = true;
                            wfe.coords.weekday = {
                                X: 0,
                                Y: 0,
                                ImageIndex: 210,
                                ImagesCount: 7
                            }
                        }
                        break;
                    }
                case 'dateOneLine':
                    {
                        if ('dateoneline' in wfe.coords) {
                            delete wfe.coords.dateoneline;
                            if (!('weekday' in wfe.coords))
                                wfe.coords.date = false;
                            if (!('dateday' in wfe.coords || 'datemonth' in wfe.coords))
                                delete wfe.coords.monthandday;
                        } else {
                            wfe.coords.date = true;
                            wfe.coords.monthandday = {
                                TwoDigitsMonth: true,
                                TwoDigitsDay: true
                            }
                            wfe.coords.dateoneline = {
                                Number: {
                                    TopLeftX: 0,
                                    TopLeftY: 0,
                                    BottomRightX: 42,
                                    BottomRightY: 9,
                                    Alignment: 'TopLeft',
                                    Spacing: 2,
                                    ImageIndex: 200,
                                    ImagesCount: 10
                                },
                                DelimiterImageIndex: 219
                            }
                        }
                        break;
                    }
                case 'dateDay':
                    {
                        if ('dateday' in wfe.coords) {
                            delete wfe.coords.dateday;
                            if (!('datemonth' in wfe.coords || 'dateoneline' in wfe.coords)) {
                                delete wfe.coords.monthandday;
                                wfe.coords.date = false;
                            }
                        } else {
                            wfe.coords.date = true;
                            if (!('monthandday' in wfe.coords))
                                wfe.coords.monthandday = {
                                    TwoDigitsMonth: true,
                                    TwoDigitsDay: true
                                }
                            wfe.coords.dateday = {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 15,
                                BottomRightY: 9,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            }
                        }
                        break;
                    }
                case 'dateMonth':
                    {
                        if ('datemonth' in wfe.coords) {
                            delete wfe.coords.datemonth;
                            if (!('dateday' in wfe.coords || 'dateoneline' in wfe.coords)) {
                                delete wfe.coords.monthandday;
                                wfe.coords.date = false;
                            }
                        } else {
                            wfe.coords.date = true;
                            if (!('monthandday' in wfe.coords))
                                wfe.coords.monthandday = {
                                    TwoDigitsMonth: true,
                                    TwoDigitsDay: true
                                }
                            wfe.coords.datemonth = {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 15,
                                BottomRightY: 9,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            }
                        }
                        break;
                    }
                case 'statAlarm':
                    {
                        if (!(wfe.coords.status))
                            wfe.coords.status = true;
                        if ('statalarm' in wfe.coords) {
                            delete wfe.coords.statalarm;
                            if (!('statalarm' in wfe.coords || 'statbt' in wfe.coords || 'statlock' in wfe.coords || 'statdnd' in wfe.coords))
                                wfe.coords.status = false;
                        } else
                            wfe.coords.statalarm = {
                                Coordinates: {
                                    X: 0,
                                    Y: 0
                                },
                                ImageIndexOn: 224
                            }
                        break;
                    }
                case 'statBt':
                    {
                        if (!(wfe.coords.status))
                            wfe.coords.status = true;
                        if ('statbt' in wfe.coords) {
                            delete wfe.coords.statbt;
                            if (!('statalarm' in wfe.coords || 'statbt' in wfe.coords || 'statlock' in wfe.coords || 'statdnd' in wfe.coords))
                                wfe.coords.status = false;
                        } else
                            wfe.coords.statbt = {
                                Coordinates: {
                                    X: 0,
                                    Y: 0
                                },
                                ImageIndexOn: 220,
                                ImageIndexOff: 221
                            }
                        break;
                    }
                case 'statLock':
                    {
                        if (!(wfe.coords.status))
                            wfe.coords.status = true;
                        if ('statlock' in wfe.coords) {
                            delete wfe.coords.statlock;
                            if (!('statalarm' in wfe.coords || 'statbt' in wfe.coords || 'statlock' in wfe.coords || 'statdnd' in wfe.coords))
                                wfe.coords.status = false;
                        } else
                            wfe.coords.statlock = {
                                Coordinates: {
                                    X: 0,
                                    Y: 0
                                },
                                ImageIndexOn: 223
                            }
                        break;
                    }
                case 'statDnd':
                    {
                        if (!(wfe.coords.status))
                            wfe.coords.status = true;
                        if ('statdnd' in wfe.coords) {
                            delete wfe.coords.statdnd;
                            if (!('statalarm' in wfe.coords || 'statbt' in wfe.coords || 'statlock' in wfe.coords || 'statdnd' in wfe.coords))
                                wfe.coords.status = false;
                        } else
                            wfe.coords.statdnd = {
                                Coordinates: {
                                    X: 0,
                                    Y: 0
                                },
                                ImageIndexOn: 222
                            }
                        break;
                    }
                case 'actSteps':
                    {
                        if (!(wfe.coords.activity))
                            wfe.coords.activity = true;
                        if ('actsteps' in wfe.coords) {
                            delete wfe.coords.actsteps;
                            if (!('actsteps' in wfe.coords || 'actstepsgoal' in wfe.coords || 'actcal' in wfe.coords || 'actpulse' in wfe.coords || 'actdist' in wfe.coords))
                                wfe.coords.activity = false;
                        } else
                            wfe.coords.actsteps = {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 42,
                                BottomRightY: 9,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            }
                        break;
                    }
                case 'actCal':
                    {
                        if (!(wfe.coords.activity))
                            wfe.coords.activity = true;
                        if ('actcal' in wfe.coords) {
                            delete wfe.coords.actcal;
                            if (!('actsteps' in wfe.coords || 'actstepsgoal' in wfe.coords || 'actcal' in wfe.coords || 'actpulse' in wfe.coords || 'actdist' in wfe.coords))
                                wfe.coords.activity = false;
                        } else
                            wfe.coords.actcal = {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 33,
                                BottomRightY: 9,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            }
                        break;
                    }
                case 'actPulse':
                    {
                        if (!(wfe.coords.activity))
                            wfe.coords.activity = true;
                        if ('actpulse' in wfe.coords) {
                            delete wfe.coords.actpulse;
                            if (!('actsteps' in wfe.coords || 'actstepsgoal' in wfe.coords || 'actcal' in wfe.coords || 'actpulse' in wfe.coords || 'actdist' in wfe.coords))
                                wfe.coords.activity = false;
                        } else
                            wfe.coords.actpulse = {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 24,
                                BottomRightY: 9,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            }
                        break;
                    }
                case 'actStepsGoal':
                    {
                        if (!(wfe.coords.activity))
                            wfe.coords.activity = true;
                        if ('actstepsgoal' in wfe.coords) {
                            delete wfe.coords.actstepsgoal;
                            if (!('actsteps' in wfe.coords || 'actstepsgoal' in wfe.coords || 'actcal' in wfe.coords || 'actpulse' in wfe.coords || 'actdist' in wfe.coords))
                                wfe.coords.activity = false;
                        } else
                            wfe.coords.actstepsgoal = {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 42,
                                BottomRightY: 9,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            }
                        break;
                    }
                case 'actDistance':
                    {
                        if (!(wfe.coords.activity))
                            wfe.coords.activity = true;
                        if ('actdist' in wfe.coords) {
                            delete wfe.coords.actdist;
                            if (!('actsteps' in wfe.coords || 'actstepsgoal' in wfe.coords || 'actcal' in wfe.coords || 'actpulse' in wfe.coords || 'actdist' in wfe.coords))
                                wfe.coords.activity = false;
                        } else
                            wfe.coords.actdist = {
                                Number: {
                                    TopLeftX: 0,
                                    TopLeftY: 0,
                                    BottomRightX: 58,
                                    BottomRightY: 9,
                                    Alignment: "TopLeft",
                                    Spacing: 2,
                                    ImageIndex: 200,
                                    ImagesCount: 10
                                },
                                SuffixImageIndex: 231,
                                DecimalPointImageIndex: 232
                            }
                        break;
                    }
                case 'batteryIcon':
                    {
                        if (!(wfe.coords.battery))
                            wfe.coords.battery = true;
                        if ('batteryicon' in wfe.coords) {
                            delete wfe.coords.batteryicon;
                            if (!('batteryicon' in wfe.coords || 'batteryscale' in wfe.coords || 'batterytext' in wfe.coords))
                                wfe.coords.battery = false;
                        } else
                            wfe.coords.batteryicon = {
                                X: 0,
                                Y: 0,
                                ImageIndex: 225,
                                ImagesCount: 6
                            }
                        break;
                    }
                case 'batteryText':
                    {
                        if (!(wfe.coords.battery))
                            wfe.coords.battery = true;
                        if ('batterytext' in wfe.coords) {
                            delete wfe.coords.batterytext;
                            if (!('batteryicon' in wfe.coords || 'batteryscale' in wfe.coords || 'batterytext' in wfe.coords))
                                wfe.coords.battery = false;
                        } else
                            wfe.coords.batterytext = {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 24,
                                BottomRightY: 9,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            }
                        break;
                    }
                case 'batteryScale':
                    {
                        if (!(wfe.coords.battery))
                            wfe.coords.battery = true;
                        if ('batteryscale' in wfe.coords) {
                            delete wfe.coords.batteryscale;
                            if (!('batteryicon' in wfe.coords || 'batteryscale' in wfe.coords || 'batterytext' in wfe.coords))
                                wfe.coords.battery = false;
                        } else
                            wfe.coords.batteryscale = {
                                StartImageIndex: 200,
                                Segments: [{
                                    X: 40,
                                    Y: 42
                    }, {
                                    X: 55,
                                    Y: 42
                    }, {
                                    X: 70,
                                    Y: 42
                    }, {
                                    X: 86,
                                    Y: 42
                    }, {
                                    X: 101,
                                    Y: 42
                    }, {
                                    X: 115,
                                    Y: 42
                    }, {
                                    X: 129,
                                    Y: 42
                    }]
                            }
                        break;
                    }
                case 'weatherIcon':
                    {
                        if (!(wfe.coords.weather))
                            wfe.coords.weather = true;
                        if (wfe.coords.weathericon) {
                            delete wfe.coords.weathericon;
                            if (!('weathericon' in wfe.coords || 'weatherair' in wfe.coords || 'weatheroneline' in wfe.coords || 'weathercur' in wfe.coords || 'weatherday' in wfe.coords || 'weathernight' in wfe.coords))
                                wfe.coords.weather = false;
                        } else
                            wfe.coords.weathericon = {
                                Coordinates: {
                                    X: 0,
                                    Y: 0
                                }
                            }
                        break;
                    }
                case 'weatherIconCustom':
                    {
                        if (!(wfe.coords.weather))
                            wfe.coords.weather = true;
                        if (wfe.coords.weathericon) {
                            delete wfe.coords.weathericon;
                            if (!('weathericon' in wfe.coords || 'weatherair' in wfe.coords || 'weatheroneline' in wfe.coords || 'weathercur' in wfe.coords || 'weatherday' in wfe.coords || 'weathernight' in wfe.coords))
                                wfe.coords.weather = false;
                        } else
                            wfe.coords.weathericon = {
                                CustomIcon: {
                                    X: 0,
                                    Y: 0,
                                    ImageIndex: 267,
                                    ImagesCount: 26
                                }
                            }
                        break;
                    }
                case 'weatherAir':
                    {
                        if (!(wfe.coords.weather))
                            wfe.coords.weather = true;
                        if ('weatherair' in wfe.coords) {
                            delete wfe.coords.weatherair;
                            if (!('weathericon' in wfe.coords || 'weatherair' in wfe.coords || 'weatheroneline' in wfe.coords || 'weathercur' in wfe.coords || 'weatherday' in wfe.coords || 'weathernight' in wfe.coords))
                                wfe.coords.weather = false;
                        } else
                            wfe.coords.weatherair = {
                                Icon: {
                                    X: 0,
                                    Y: 0,
                                    ImageIndex: 235,
                                    ImagesCount: 6
                                }
                            }
                        break;
                    }
                case 'weatherOneLine':
                    {
                        if (!(wfe.coords.weather))
                            wfe.coords.weather = true;
                        if ('weatheroneline' in wfe.coords) {
                            delete wfe.coords.weatheroneline;
                            if (!('weathericon' in wfe.coords || 'weatherair' in wfe.coords || 'weatheroneline' in wfe.coords || 'weathercur' in wfe.coords || 'weatherday' in wfe.coords || 'weathernight' in wfe.coords))
                                wfe.coords.weather = false;
                        } else
                            wfe.coords.weatheroneline = {
                                Number: {
                                    TopLeftX: 0,
                                    TopLeftY: 0,
                                    BottomRightX: 66,
                                    BottomRightY: 9,
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
                        break;
                    }
                case 'weatherCurrent':
                    {
                        if (!(wfe.coords.weather))
                            wfe.coords.weather = true;
                        if ('weathercur' in wfe.coords) {
                            delete wfe.coords.weathercur;
                            if (!('weathericon' in wfe.coords || 'weatherair' in wfe.coords || 'weatheroneline' in wfe.coords || 'weathercur' in wfe.coords || 'weatherday' in wfe.coords || 'weathernight' in wfe.coords))
                                wfe.coords.weather = false;
                        } else
                            wfe.coords.weathercur = {
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
                            }
                        break;
                    }
                case 'weatherDay':
                    {
                        if (!(wfe.coords.weather))
                            wfe.coords.weather = true;
                        if ('weatherday' in wfe.coords) {
                            delete wfe.coords.weatherday;
                            if (!('weathericon' in wfe.coords || 'weatherair' in wfe.coords || 'weatheroneline' in wfe.coords || 'weathercur' in wfe.coords || 'weatherday' in wfe.coords || 'weathernight' in wfe.coords))
                                wfe.coords.weather = false;
                        } else
                            wfe.coords.weatherday = {
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
                            }
                        break;
                    }
                case 'weatherNight':
                    {
                        if (!(wfe.coords.weather))
                            wfe.coords.weather = true;
                        if ('weathernight' in wfe.coords) {
                            delete wfe.coords.weathernight;
                            if (!('weathericon' in wfe.coords || 'weatherair' in wfe.coords || 'weatheroneline' in wfe.coords || 'weathercur' in wfe.coords || 'weatherday' in wfe.coords || 'weathernight' in wfe.coords))
                                wfe.coords.weather = false;
                        } else
                            wfe.coords.weathernight = {
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
                            }
                        break;
                    }
                case 'stepsGoal':
                    {
                        if (!(wfe.coords.stepsprogress))
                            wfe.coords.stepsprogress = true;
                        if ('stepsgoal' in wfe.coords) {
                            delete wfe.coords.stepsgoal;
                            if (!('stepslinear' in wfe.coords || 'stepsgoal' in wfe.coords || 'stepscircle' in wfe.coords))
                                wfe.coords.stepsprogress = false;
                        } else
                            wfe.coords.stepsgoal = {
                                X: 0,
                                Y: 0,
                                ImageIndex: 266
                            }
                        break;
                    }
                case 'stepsLinear':
                    {
                        if (!(wfe.coords.stepsprogress))
                            wfe.coords.stepsprogress = true;
                        if ('stepslinear' in wfe.coords) {
                            delete wfe.coords.stepslinear;
                            if (!('stepslinear' in wfe.coords || 'stepsgoal' in wfe.coords || 'stepscircle' in wfe.coords))
                                wfe.coords.stepsprogress = false;
                        } else
                            wfe.coords.stepslinear = {
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
                        break;
                    }
                default:
                    console.error('Error in toggle: ', el);
            }
            jsoneditor.updatecode();
            jsoneditor.select(jsoneditor.toggleElements[el]);
        },
        select: function (s) {
            var target = jsoneditor.findspan(s);
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
        init: function () {
            if (!('editortabversion' in localStorage) || localStorage.editortabversion < wfe.app.editortabversion)
                localStorage.editortabversion = wfe.app.editortabversion;
            jsoneditor.updatecode();
            if (wfe.app.firstopen_editor && localStorage.showcount < 8) {
                sessionStorage.firstopen_editor = false;
                UIkit.notification(('jsonupdate' in wfe.app.lang ? wfe.app.lang.jsonupdate : "To update preview just click out of JSON input"), {
                    status: 'primary',
                    pos: 'top-left',
                    timeout: 3000
                });
                wfe.app.firstopen_editor = false;
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
            if (wfe.app.notWebkitBased) {
                var blob = new Blob([JSON.stringify(wfe.data.export(), null, 4)], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, wfe.data.wfname + '.json');
            } else {
                var a = document.createElement('a');
                a.href = 'data:application/octet-stream;base64, ' + btoa(JSON.stringify(wfe.data.export(), null, 4));
                a.download = wfe.data.wfname + '.json';
                a.click();
            }
        },
        codeareablur: function () {
            try {
                wfe.coordsHistory.push(JSON.stringify(wfe.coords));
                wfe.data.import(jsonlint.parse($("codearea").innerText));
                jsoneditor.updatecode();
            } catch (error) {
                $("jsonerrortext").innerHTML = error;
                setTimeout(function () {
                    UIkit.modal($("jsonerrormodal")).show();
                }, 250);
                console.warn(error);
            }
        },
        undo: function () {
            if (wfe.coordsHistory.length) {
                wfe.coords = JSON.parse(wfe.coordsHistory.pop());
                jsoneditor.updatecode();
            }
        },
        regexr: /<\/?\w*>|<\w*\s\w*="#[\w\d]{6}">|<([\w\s]*="[\s\w:(,);\-&.]*")*>/g,
        regexrimg: /"(Suffix|DecimalPoint|MinusSign|Degrees|Minus|)ImageIndex(On|Off|Am|Pm|)":\s(2|3)\d\d/g
    },
    analog = {
        init: function () {
            if (!('analogtabversion' in localStorage) || localStorage.analogtabversion < wfe.app.analogtabversion)
                localStorage.analogtabversion = wfe.app.analogtabversion;
            if ('bg' in wfe.coords) {
                var bg = $c(wfe.coords.bg.Image.ImageIndex);
                bg.style.left = wfe.coords.bg.Image.X * 3 + "px";
                bg.style.top = wfe.coords.bg.Image.Y * 3 + "px";
                bg.style.position = "absolute";
                bg.style.zIndex = -1;
                bg.height *= 3;
                bg.width *= 3;
                bg.removeAttribute("id");
                bg.ondragstart = function () {
                    return false;
                };
                $("analog-bg").appendChild(bg);
            }
            $('analog-color').onchange = function () {
                analog.currentElement.Color = $('analog-color').value;
                analog.update();
            }
            $('analog-center-x').onchange = function () {
                analog.currentElement.Center.X = Number($('analog-center-x').value);
                analog.update();
            }
            $('analog-center-y').onchange = function () {
                analog.currentElement.Center.Y = Number($('analog-center-y').value);
                analog.update();
            }
            $('analog-fill').onchange = function () {
                if ($('analog-fill').checked)
                    analog.currentElement.OnlyBorder = false;
                else
                    analog.currentElement.OnlyBorder = true;
                analog.update();
            }
            analog.update('hours');
        },
        update: function (arrow) {
            if (arrow != undefined) {
                switch (arrow) {
                    case 'hours':
                        analog.currentElement = wfe.coords.analoghours;
                        break;
                    case 'minutes':
                        analog.currentElement = wfe.coords.analogminutes;
                        break;
                    case 'seconds':
                        analog.currentElement = wfe.coords.analogseconds;
                        break;
                }
                analog.currentElementName = arrow;
            }
            analog.dotCount = 0;
            view.makeWf();
            $("analog").innerHTML = '';
            if (('analog' + analog.currentElementName) in wfe.coords) {
                $("analog").innerHTML += '<div class="analog-center" style="left: ' + (analog.currentElement.Center.X * 3 - 11) + 'px;top:' + (analog.currentElement.Center.Y * 3 - 11) + 'px"></div>';
                $("analog").innerHTML += '<div class="analog-line" style="left: ' + (analog.currentElement.Center.X * 3 - 3) + 'px;height:' + (analog.currentElement.Center.Y * 3 - 11) + 'px"></div>';
                $("analog").innerHTML += '<svg id="analogsvg" width="528" height="528"></svg>';
                for (var i in $("analog").childNodes)
                    $("analog").childNodes[i].oncontextmenu = function (e) {
                        e.preventDefault();
                    }
                analog.drawAnalog(analog.currentElement, 0);
                $('analog').onclick = function (e) {
                    analog.addDot(e);
                }
                $('analog-center-x').value = analog.currentElement.Center.X;
                $('analog-center-y').value = analog.currentElement.Center.Y;
                $('analog-fill').checked = !analog.currentElement.OnlyBorder;
                $('analog-color').style.backgroundColor = analog.currentElement.Color;
                $('analog-color').value = '';
            } else $('analog').onclick = function (e) {
                return false;
            }
        },
        addDot: function (e) {
            if (analog.dotCount >= 12)
                return;
            var ed = editor.getOffsetRect($("analog"));
            var d = document.createElement('div');
            d.classList.add('analog-dot');
            d.id = 'dot' + analog.dotCount++;
            d.style.left = e.pageX - ed.left - (e.pageX - ed.left) % 3 + 'px';
            d.style.top = e.pageY - ed.top - (e.pageY - ed.top) % 3 + 'px';
            d.oncontextmenu = function (e) {
                e.preventDefault();
                analog.removeDot(e);
            };
            var c = {
                X: (Number(d.style.top.replace('px', '')) + 3 - analog.currentElement.Center.X * 3) / -3,
                Y: (Number(d.style.left.replace('px', '')) + 3 - analog.currentElement.Center.X * 3) / 3
            }
            analog.currentElement.Shape.push(c);
            analog.update(analog.currentElementName);
        },
        removeDot: function (e) {
            if (analog.dotCount > 2) {
                analog.currentElement.Shape.splice(Number(e.target.id.replace('dot', '')), 1);
                analog.dotCount--;
                analog.update(analog.currentElementName);
            }
        },
        drawAnalog: function (el, value) {
            var col = el.Color.replace("0x", "#"),
                d = "M " + el.Shape[0].X * 3 + " " + el.Shape[0].Y * 3,
                iters = el.Shape.length,
                fill = el.OnlyBorder ? "none" : col;
            for (var i = 0; i < iters; i++) {
                d += "L " + el.Shape[i].X * 3 + " " + el.Shape[i].Y * 3 + " ";
                var dot = document.createElement('div');
                dot.classList.add('analog-dot');
                dot.id = 'dot' + analog.dotCount++;
                dot.style.left = el.Shape[i].Y * 3 + el.Center.X * 3 - 4 + 'px';
                dot.style.top = el.Shape[i].X * 3 * (-1) + el.Center.Y * 3 - 4 + 'px';
                dot.oncontextmenu = function (e) {
                    e.preventDefault();
                    analog.removeDot(e);
                };
                analog.moveDot(dot, analog.currentElement.Shape[i]);
                $('analog').appendChild(dot);
            }
            d += "L " + el.Shape[0].X * 3 + " " + el.Shape[0].Y * 3 + " ";
            $('analogsvg').innerHTML += '<path d="' + d + '" transform="rotate(' + (value - 90) + ' ' + el.Center.X * 3 + ' ' + el.Center.Y * 3 + ') translate(' + el.Center.X * 3 + " " + el.Center.Y * 3 + ') " fill="' + fill + '" stroke="' + col + '"></path>';
            if ('CenterImage' in el) {
                view.setPosN(el.CenterImage, 0, "c_an_img");
            }
        },
        currentElement: {},
        currentElementName: 'hours',
        dotCount: 0,
        toggle: function (elem) {
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
                                X: 88,
                                Y: 88
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
                        }
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
                                X: 88,
                                Y: 88
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
                            }]
                        }
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
                                X: 88,
                                Y: 88
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
                            }]
                        }
                    }
                    break;
            }
            analog.init(elem);
        },
        moveDot: function (el, elcoords) {
            el.onmousedown = function (e) {
                if (e.which != 1) return;
                var ed = editor.getOffsetRect($("analog"));
                var curcoords = getCoords(el);
                var shiftX = e.pageX - curcoords.left;
                var shiftY = e.pageY - curcoords.top;

                el.style.position = 'absolute';
                moveAt(e);

                el.style.zIndex = 1000;

                function moveAt(e) {
                    el.style.left = e.pageX - ed.left - shiftX + 'px';
                    el.style.top = e.pageY - ed.top - shiftY + 'px';
                }

                $("analog").onmousemove = function (e) {
                    moveAt(e);
                };

                el.onmouseup = function () {
                    $("analog").onmousemove = null;
                    el.onmouseup = null;
                    el.style.zIndex = 'auto';
                    el.style.top = editor.styleToNum(el.style.top) > 0 && editor.styleToNum(el.style.top) < 528 ? editor.styleToNum(el.style.top) - editor.styleToNum(el.style.top) % 3 + 'px' : "0px";
                    el.style.left = editor.styleToNum(el.style.left) > 0 && editor.styleToNum(el.style.left) < 528 ? editor.styleToNum(el.style.left) - editor.styleToNum(el.style.left) % 3 + 'px' : "0px";

                    elcoords.X = (Number(el.style.top.replace('px', '')) + 3 - analog.currentElement.Center.X * 3) / -3;
                    elcoords.Y = (Number(el.style.left.replace('px', '')) + 3 - analog.currentElement.Center.X * 3) / 3;
                    analog.update(analog.currentElementName);
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

        }
    },
    imagestab = {
        init: function () {
            if (!('imagestabversion' in localStorage) || localStorage.imagestabversion < wfe.app.imagestabversion)
                localStorage.imagestabversion = wfe.app.imagestabversion;
            $("imagesinuse").innerHTML = '';
            $("imagesavalible").innerHTML = '';
            if ('bg' in wfe.coords)
                imagestab.insertimg({
                    label: "Background"
                }, wfe.coords.bg.Image.ImageIndex);
            if ('time' in wfe.coords) {
                imagestab.insertimg({
                    label: "Time hours tens"
                }, wfe.coords.time.Hours.Tens.ImageIndex, wfe.coords.time.Hours.Tens.ImagesCount);
                imagestab.insertimg({
                    label: "Time hours ones"
                }, wfe.coords.time.Hours.Ones.ImageIndex, wfe.coords.time.Hours.Ones.ImagesCount);
                imagestab.insertimg({
                    label: "Time minutes tens"
                }, wfe.coords.time.Minutes.Tens.ImageIndex, wfe.coords.time.Minutes.Tens.ImagesCount);
                imagestab.insertimg({
                    label: "Time minutes ones"
                }, wfe.coords.time.Minutes.Ones.ImageIndex, wfe.coords.time.Minutes.Ones.ImagesCount);
                if ('seconds' in wfe.coords) {
                    imagestab.insertimg({
                        label: "Time seconds tens"
                    }, wfe.coords.seconds.Tens.ImageIndex, wfe.coords.seconds.Tens.ImagesCount);
                    imagestab.insertimg({
                        label: "Time seconds ones"
                    }, wfe.coords.seconds.Ones.ImageIndex, wfe.coords.seconds.Ones.ImagesCount);
                }
                if ('ampm' in wfe.coords)
                    imagestab.insertimg({
                        label: "Time am/pm"
                    }, wfe.coords.ampm.ImageIndexAm, 1, wfe.coords.ampm.ImageIndexPm);
            }
            if (wfe.coords.date) {
                if ('weekday' in wfe.coords) {
                    imagestab.insertimg({
                        label: "Week day"
                    }, wfe.coords.weekday.ImageIndex, wfe.coords.weekday.ImagesCount);
                }
                if ('dateday' in wfe.coords) {
                    imagestab.insertimg({
                        label: "Date day"
                    }, wfe.coords.dateday.ImageIndex, wfe.coords.dateday.ImagesCount);
                }
                if ('datemonth' in wfe.coords) {
                    imagestab.insertimg({
                        label: "Date month"
                    }, wfe.coords.datemonth.ImageIndex, wfe.coords.datemonth.ImagesCount);
                }
                if ('dateoneline' in wfe.coords) {
                    imagestab.insertimg({
                        label: "Date oneline",
                        addition: (", " + wfe.coords.dateoneline.DelimiterImageIndex)
                    }, wfe.coords.dateoneline.Number.ImageIndex, wfe.coords.dateoneline.Number.ImagesCount, wfe.coords.dateoneline.DelimiterImageIndex);
                }
            }
            if (wfe.coords.battery) {
                if ('batteryicon' in wfe.coords)
                    imagestab.insertimg({
                        label: "Battery icon"
                    }, wfe.coords.batteryicon.ImageIndex, wfe.coords.batteryicon.ImagesCount);
                if ('batterytext' in wfe.coords)
                    imagestab.insertimg({
                        label: "Battery text"
                    }, wfe.coords.batterytext.ImageIndex, wfe.coords.batterytext.ImagesCount);
                if ('batteryscale' in wfe.coords)
                    imagestab.insertimg({
                        label: "Battery scale"
                    }, wfe.coords.batteryscale.StartImageIndex, wfe.coords.batteryscale.Segments.length);
            }
            if (wfe.coords.status) {
                if ('statalarm' in wfe.coords)
                    imagestab.insertimg({
                        label: "Status alarm"
                    }, wfe.coords.statalarm.ImageIndexOn, 1);
                if ('statbt' in wfe.coords)
                    imagestab.insertimg({
                        label: "Status bluetooth",
                        addition: (", " + wfe.coords.statbt.ImageIndexOff)
                    }, wfe.coords.statbt.ImageIndexOn, 1, wfe.coords.statbt.ImageIndexOff);
                if ('statdnd' in wfe.coords)
                    imagestab.insertimg({
                        label: "Status do not disturb"
                    }, wfe.coords.statdnd.ImageIndexOn, 1);
                if ('statlock' in wfe.coords)
                    imagestab.insertimg({
                        label: "Status lock"
                    }, wfe.coords.statlock.ImageIndexOn, 1);
            }
            if (wfe.coords.activity) {
                if ('actcal' in wfe.coords)
                    imagestab.insertimg({
                        label: "Activity calories"
                    }, wfe.coords.actcal.ImageIndex, wfe.coords.actcal.ImagesCount);
                if ('actsteps' in wfe.coords)
                    imagestab.insertimg({
                        label: "Activity steps"
                    }, wfe.coords.actsteps.ImageIndex, wfe.coords.actsteps.ImagesCount);
                if ('statstepsgoal' in wfe.coords)
                    imagestab.insertimg({
                        label: "Activity steps goal"
                    }, wfe.coords.actstepsgoal.ImageIndex, wfe.coords.actstepsgoal.ImagesCount);
                if ('actpulse' in wfe.coords)
                    imagestab.insertimg({
                        label: "Activity pulse"
                    }, wfe.coords.actpulse.ImageIndex, wfe.coords.actpulse.ImagesCount);
                if ('actdist' in wfe.coords)
                    imagestab.insertimg({
                        label: "Activity distance",
                        addition: (", " + wfe.coords.actdist.DecimalPointImageIndex + ", " + wfe.coords.actdist.SuffixImageIndex)
                    }, wfe.coords.actdist.Number.ImageIndex, wfe.coords.actdist.Number.ImagesCount, wfe.coords.actdist.DecimalPointImageIndex, wfe.coords.actdist.SuffixImageIndex);
            }
            if (wfe.coords.weather) {
                if (wfe.coords.weathericon)
                    if ('CustomIcon' in wfe.coords.weathericon) {
                        imagestab.insertimg({
                            label: "Weather icons"
                        }, wfe.coords.weathericon.CustomIcon.ImageIndex, wfe.coords.weathericon.CustomIcon.ImagesCount);
                    }
                if ('weatheroneline' in wfe.coords)
                    imagestab.insertimg({
                        label: "Weather oneline",
                        addition: (", " + wfe.coords.weatheroneline.MinusSignImageIndex + ", " + wfe.coords.weatheroneline.DelimiterImageIndex + ", " + wfe.coords.weatheroneline.DegreesImageIndex)
                    }, wfe.coords.weatheroneline.Number.ImageIndex, wfe.coords.weatheroneline.Number.ImagesCount, wfe.coords.weatheroneline.MinusSignImageIndex, wfe.coords.weatheroneline.DelimiterImageIndex, wfe.coords.weatheroneline.DegreesImageIndex);
                if ('weatherday' in wfe.coords)
                    imagestab.insertimg({
                        label: "Weather day",
                        addition: (", " + wfe.coords.weatherday.MinusImageIndex)
                    }, wfe.coords.weatherday.Number.ImageIndex, wfe.coords.weatherday.Number.ImagesCount, wfe.coords.weatherday.MinusImageIndex);
                if ('weathernight' in wfe.coords)
                    imagestab.insertimg({
                        label: "Weather night",
                        addition: (", " + wfe.coords.weathernight.MinusImageIndex)
                    }, wfe.coords.weathernight.Number.ImageIndex, wfe.coords.weathernight.Number.ImagesCount, wfe.coords.weathernight.MinusImageIndex);

                if ('weathercur' in wfe.coords)
                    imagestab.insertimg({
                        label: "Weather current",
                        addition: (", " + wfe.coords.weathercur.MinusImageIndex + ", " + wfe.coords.weathercur.DegreesImageIndex)
                    }, wfe.coords.weathercur.Number.ImageIndex, wfe.coords.weathercur.Number.ImagesCount, wfe.coords.weathercur.MinusImageIndex, wfe.coords.weathercur.DegreesImageIndex);
                if ('weatherair' in wfe.coords)
                    imagestab.insertimg({
                        label: "Weather air pollution"
                    }, wfe.coords.weatherair.Icon.ImageIndex, wfe.coords.weatherair.Icon.ImagesCount);
            }
            if (wfe.coords.stepsprogress) {
                if ('stepslinear' in wfe.coords)
                    imagestab.insertimg({
                        label: "Steps progress"
                    }, wfe.coords.stepslinear.StartImageIndex, wfe.coords.stepslinear.Segments.length);
                if ('stepsgoal' in wfe.coords)
                    imagestab.insertimg({
                        label: "Goal image"
                    }, wfe.coords.stepsgoal.ImageIndex, 1);
            }
            imagestab.insertimg({
                label: "Big digits",
                insertto: "imagesavalible"
            }, 255, 10);
            imagestab.insertimg({
                label: "Digits",
                insertto: "imagesavalible"
            }, 200, 10);
            imagestab.insertimg({
                label: "Week days",
                insertto: "imagesavalible"
            }, 210, 7);
            imagestab.insertimg({
                label: "Week days russian",
                insertto: "imagesavalible"
            }, 241, 7);
            imagestab.insertimg({
                label: "Week days russian inverted",
                insertto: "imagesavalible"
            }, 248, 7);
            imagestab.insertimg({
                label: "Week days finnish",
                insertto: "imagesavalible"
            }, 294, 7);
            imagestab.insertimg({
                label: "Battery icon",
                insertto: "imagesavalible"
            }, 225, 6);
            imagestab.insertimg({
                label: "Air pollution",
                insertto: "imagesavalible"
            }, 235, 6);
            imagestab.insertimg({
                label: "Weather symbols",
                insertto: "imagesavalible",
                addition: ", 218, 219"
            }, 217, 3);
            imagestab.insertimg({
                label: "Bluetooth",
                insertto: "imagesavalible",
                addition: ", 221"
            }, 220, 2);
            imagestab.insertimg({
                label: "Distance symbols",
                insertto: "imagesavalible",
                addition: ", 232"
            }, 231, 2);
            imagestab.insertimg({
                label: "Am/Pm",
                insertto: "imagesavalible",
                addition: ", 234"
            }, 233, 2);
            imagestab.insertimg({
                label: "Status images",
                insertto: "imagesavalible",
                addition: ", 223, 224"
            }, 222, 3);
            imagestab.insertimg({
                label: "Steps goal image",
                insertto: "imagesavalible"
            }, 266, 1);
            imagestab.insertimg({
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

wfe.init();
