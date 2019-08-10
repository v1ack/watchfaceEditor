/* global UIkit, jsonlint, saveAs */
import {
    $ as $
} from './utils.js';
import wfe from './wfe_obj.js';

let elements = ['seconds', 'amPm', 'weekDay', 'dateDay', 'dateMonth', 'dateOneLine', 'batteryIcon', 'batteryText', 'batteryScale', 'statAlarm', 'statBt', 'statDnd', 'statLock', 'actCal', 'actSteps', 'actStepsGoal', 'actPulse', 'actDistance', 'weatherOneLine', 'weatherDay', 'weatherNight', 'weatherCurrent', 'stepsLinear', 'stepsGoal', 'weatherAirIcon', 'weatherAirText', 'weatherDayAlt', 'weatherNightAlt'];

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

function toggle(el) {
    switch (el) {
        case 'amPm':
            {
                if ('amPm' in wfe.coords) {
                    delete wfe.coords.amPm;
                } else {
                    wfe.coords.amPm = {
                        X: 0,
                        Y: 0,
                        ImageIndexAm: 233,
                        ImageIndexPm: 234
                    };
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
                if ('weekDay' in wfe.coords) {
                    delete wfe.coords.weekDay;
                    if (!('monthandday' in wfe.coords))
                        wfe.coords.date = false;
                } else {
                    wfe.coords.date = true;
                    wfe.coords.weekDay = {
                        X: 0,
                        Y: 0,
                        ImageIndex: 210,
                        ImagesCount: 7
                    };
                }
                break;
            }
        case 'dateOneLine':
            {
                if ('dateOneLine' in wfe.coords) {
                    delete wfe.coords.dateOneLine;
                    if (!('weekDay' in wfe.coords))
                        wfe.coords.date = false;
                    if (!('dateDay' in wfe.coords || 'dateMonth' in wfe.coords))
                        delete wfe.coords.monthandday;
                } else {
                    wfe.coords.date = true;
                    wfe.coords.monthandday = {
                        TwoDigitsMonth: true,
                        TwoDigitsDay: true
                    };
                    wfe.coords.dateOneLine = {
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
                    };
                }
                break;
            }
        case 'dateDay':
            {
                if ('dateDay' in wfe.coords) {
                    delete wfe.coords.dateDay;
                    if (!('dateMonth' in wfe.coords || 'dateOneLine' in wfe.coords)) {
                        delete wfe.coords.monthandday;
                        wfe.coords.date = false;
                    }
                    if ('weekDay' in wfe.coords) {
                        wfe.coords.date = true;
                    }
                } else {
                    wfe.coords.date = true;
                    if (!('monthandday' in wfe.coords))
                        wfe.coords.monthandday = {
                            TwoDigitsMonth: true,
                            TwoDigitsDay: true
                        };
                    wfe.coords.dateDay = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 15,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    };
                }
                break;
            }
        case 'dateMonth':
            {
                if ('dateMonth' in wfe.coords) {
                    delete wfe.coords.dateMonth;
                    if (!('dateDay' in wfe.coords || 'dateOneLine' in wfe.coords)) {
                        delete wfe.coords.monthandday;
                        wfe.coords.date = false;
                    }
                    if ('weekDay' in wfe.coords) {
                        wfe.coords.date = true;
                    }
                } else {
                    wfe.coords.date = true;
                    if (!('monthandday' in wfe.coords))
                        wfe.coords.monthandday = {
                            TwoDigitsMonth: true,
                            TwoDigitsDay: true
                        };
                    wfe.coords.dateMonth = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 15,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    };
                }
                break;
            }
        case 'statAlarm':
            {
                if (!(wfe.coords.status))
                    wfe.coords.status = true;
                if ('statAlarm' in wfe.coords) {
                    delete wfe.coords.statAlarm;
                    if (!('statAlarm' in wfe.coords || 'statBt' in wfe.coords || 'statLock' in wfe.coords || 'statDnd' in wfe.coords))
                        wfe.coords.status = false;
                } else
                    wfe.coords.statAlarm = {
                        Coordinates: {
                            X: 0,
                            Y: 0
                        },
                        ImageIndexOn: 224
                    };
                break;
            }
        case 'statBt':
            {
                if (!(wfe.coords.status))
                    wfe.coords.status = true;
                if ('statBt' in wfe.coords) {
                    delete wfe.coords.statBt;
                    if (!('statAlarm' in wfe.coords || 'statBt' in wfe.coords || 'statLock' in wfe.coords || 'statDnd' in wfe.coords))
                        wfe.coords.status = false;
                } else
                    wfe.coords.statBt = {
                        Coordinates: {
                            X: 0,
                            Y: 0
                        },
                        ImageIndexOn: 220,
                        ImageIndexOff: 221
                    };
                break;
            }
        case 'statLock':
            {
                if (!(wfe.coords.status))
                    wfe.coords.status = true;
                if ('statLock' in wfe.coords) {
                    delete wfe.coords.statLock;
                    if (!('statAlarm' in wfe.coords || 'statBt' in wfe.coords || 'statLock' in wfe.coords || 'statDnd' in wfe.coords))
                        wfe.coords.status = false;
                } else
                    wfe.coords.statLock = {
                        Coordinates: {
                            X: 0,
                            Y: 0
                        },
                        ImageIndexOn: 223
                    };
                break;
            }
        case 'statDnd':
            {
                if (!(wfe.coords.status))
                    wfe.coords.status = true;
                if ('statDnd' in wfe.coords) {
                    delete wfe.coords.statDnd;
                    if (!('statAlarm' in wfe.coords || 'statBt' in wfe.coords || 'statLock' in wfe.coords || 'statDnd' in wfe.coords))
                        wfe.coords.status = false;
                } else
                    wfe.coords.statDnd = {
                        Coordinates: {
                            X: 0,
                            Y: 0
                        },
                        ImageIndexOn: 222
                    };
                break;
            }
        case 'actSteps':
            {
                if (!(wfe.coords.activity))
                    wfe.coords.activity = true;
                if ('actSteps' in wfe.coords) {
                    delete wfe.coords.actSteps;
                    if (!('actSteps' in wfe.coords || 'actStepsGoal' in wfe.coords || 'actCal' in wfe.coords || 'actPulse' in wfe.coords || 'actDistance' in wfe.coords))
                        wfe.coords.activity = false;
                } else {
                    wfe.coords.actSteps = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 42,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    };
                    if (localStorage.device === 'cor')
                        wfe.coords.actSteps.cor = {};
                }
                break;
            }
        case 'actCal':
            {
                if (!(wfe.coords.activity))
                    wfe.coords.activity = true;
                if ('actCal' in wfe.coords) {
                    delete wfe.coords.actCal;
                    if (!('actSteps' in wfe.coords || 'actStepsGoal' in wfe.coords || 'actCal' in wfe.coords || 'actPulse' in wfe.coords || 'actDistance' in wfe.coords))
                        wfe.coords.activity = false;
                } else {
                    wfe.coords.actCal = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 33,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    };
                    if (localStorage.device === 'cor')
                        wfe.coords.actSteps.cor = {};
                }
                break;
            }
        case 'actPulse':
            {
                if (!(wfe.coords.activity))
                    wfe.coords.activity = true;
                if ('actPulse' in wfe.coords) {
                    delete wfe.coords.actPulse;
                    if (!('actSteps' in wfe.coords || 'actStepsGoal' in wfe.coords || 'actCal' in wfe.coords || 'actPulse' in wfe.coords || 'actDistance' in wfe.coords))
                        wfe.coords.activity = false;
                } else {
                    wfe.coords.actPulse = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 24,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    };
                    if (localStorage.device === 'cor')
                        wfe.coords.actSteps.cor = {};
                }
                break;
            }
        case 'actStepsGoal':
            {
                if (!(wfe.coords.activity))
                    wfe.coords.activity = true;
                if ('actStepsGoal' in wfe.coords) {
                    delete wfe.coords.actStepsGoal;
                    if (!('actSteps' in wfe.coords || 'actStepsGoal' in wfe.coords || 'actCal' in wfe.coords || 'actPulse' in wfe.coords || 'actDistance' in wfe.coords))
                        wfe.coords.activity = false;
                } else {
                    wfe.coords.actStepsGoal = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 42,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    };
                    if (localStorage.device === 'cor')
                        wfe.coords.actSteps.cor = {};
                }
                break;
            }
        case 'actDistance':
            {
                if (!(wfe.coords.activity))
                    wfe.coords.activity = true;
                if ('actDistance' in wfe.coords) {
                    delete wfe.coords.actDistance;
                    if (!('actSteps' in wfe.coords || 'actStepsGoal' in wfe.coords || 'actCal' in wfe.coords || 'actPulse' in wfe.coords || 'actDistance' in wfe.coords))
                        wfe.coords.activity = false;
                } else
                    wfe.coords.actDistance = {
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
                    };
                break;
            }
        case 'batteryIcon':
            {
                if (!(wfe.coords.battery))
                    wfe.coords.battery = true;
                if ('batteryIcon' in wfe.coords) {
                    delete wfe.coords.batteryIcon;
                    if (!('batteryIcon' in wfe.coords || 'batteryScale' in wfe.coords || 'batteryText' in wfe.coords))
                        wfe.coords.battery = false;
                } else
                    wfe.coords.batteryIcon = {
                        X: 0,
                        Y: 0,
                        ImageIndex: 225,
                        ImagesCount: 6
                    };
                break;
            }
        case 'batteryText':
            {
                if (!(wfe.coords.battery))
                    wfe.coords.battery = true;
                if ('batteryText' in wfe.coords) {
                    delete wfe.coords.batteryText;
                    if (!('batteryIcon' in wfe.coords || 'batteryScale' in wfe.coords || 'batteryText' in wfe.coords))
                        wfe.coords.battery = false;
                } else
                    wfe.coords.batteryText = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 24,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    };
                break;
            }
        case 'batteryScale':
            {
                if (!(wfe.coords.battery))
                    wfe.coords.battery = true;
                if ('batteryScale' in wfe.coords) {
                    delete wfe.coords.batteryScale;
                    if (!('batteryIcon' in wfe.coords || 'batteryScale' in wfe.coords || 'batteryText' in wfe.coords))
                        wfe.coords.battery = false;
                } else
                    wfe.coords.batteryScale = {
                        StartImageIndex: 200,
                        Segments: [{
                            X: 55,
                            Y: 0
                        }, {
                            X: 65,
                            Y: 0
                        }, {
                            X: 75,
                            Y: 0
                        }, {
                            X: 85,
                            Y: 0
                        }, {
                            X: 95,
                            Y: 0
                        }, {
                            X: 105,
                            Y: 0
                        }, {
                            X: 115,
                            Y: 0
                        }]
                    };
                break;
            }
        case 'weatherIcon':
            {
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
        case 'weatherIconCustom':
            {
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
        case 'weatherAirIcon':
            {
                if (!(wfe.coords.weather))
                    wfe.coords.weather = true;
                if ('weatherAirIcon' in wfe.coords) {
                    delete wfe.coords.weatherAirIcon;
                    if (!('weathericon' in wfe.coords || 'weatherAirIcon' in wfe.coords || 'weatherOneLine' in wfe.coords || 'weatherCurrent' in wfe.coords || 'weatherDay' in wfe.coords || 'weatherNight' in wfe.coords || 'weatherAirText' in wfe.coords))
                        wfe.coords.weather = false;
                } else
                    wfe.coords.weatherAirIcon = {
                        X: 0,
                        Y: 0,
                        ImageIndex: 235,
                        ImagesCount: 6
                    };
                break;
            }
        case 'weatherAirText':
            {
                if (!(wfe.coords.weather))
                    wfe.coords.weather = true;
                if ('weatherAirText' in wfe.coords) {
                    delete wfe.coords.weatherAirText;
                    if (!('weathericon' in wfe.coords || 'weatherAirIcon' in wfe.coords || 'weatherOneLine' in wfe.coords || 'weatherCurrent' in wfe.coords || 'weatherDay' in wfe.coords || 'weatherNight' in wfe.coords || 'weatherAirText' in wfe.coords))
                        wfe.coords.weather = false;
                } else
                    wfe.coords.weatherAirText = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 24,
                        BottomRightY: 9,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    };
                break;
            }
        case 'weatherOneLine':
            {
                if (!(wfe.coords.weather))
                    wfe.coords.weather = true;
                if ('weatherOneLine' in wfe.coords) {
                    delete wfe.coords.weatherOneLine;
                    if (!('weathericon' in wfe.coords || 'weatherAirIcon' in wfe.coords || 'weatherOneLine' in wfe.coords || 'weatherCurrent' in wfe.coords || 'weatherDay' in wfe.coords || 'weatherNight' in wfe.coords || 'weatherAirText' in wfe.coords))
                        wfe.coords.weather = false;
                } else
                    wfe.coords.weatherOneLine = {
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
                    };
                break;
            }
        case 'weatherCurrent':
            {
                if (!(wfe.coords.weather))
                    wfe.coords.weather = true;
                if ('weatherCurrent' in wfe.coords) {
                    delete wfe.coords.weatherCurrent;
                    if (!('weathericon' in wfe.coords || 'weatherAirIcon' in wfe.coords || 'weatherOneLine' in wfe.coords || 'weatherCurrent' in wfe.coords || 'weatherDay' in wfe.coords || 'weatherNight' in wfe.coords || 'weatherAirText' in wfe.coords))
                        wfe.coords.weather = false;
                } else
                    wfe.coords.weatherCurrent = {
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
                break;
            }
        case 'weatherDay':
            {
                if (!(wfe.coords.weather))
                    wfe.coords.weather = true;
                if ('weatherDay' in wfe.coords) {
                    delete wfe.coords.weatherDay;
                    delete wfe.coords.weatherDayAlt;
                    if (!('weathericon' in wfe.coords || 'weatherAirIcon' in wfe.coords || 'weatherOneLine' in wfe.coords || 'weatherCurrent' in wfe.coords || 'weatherDay' in wfe.coords || 'weatherNight' in wfe.coords || 'weatherAirText' in wfe.coords))
                        wfe.coords.weather = false;
                } else
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
                break;
            }
        case 'weatherNight':
            {
                if (!(wfe.coords.weather))
                    wfe.coords.weather = true;
                if ('weatherNight' in wfe.coords) {
                    delete wfe.coords.weatherNight;
                    delete wfe.coords.weatherNightAlt;
                    if (!('weathericon' in wfe.coords || 'weatherAirIcon' in wfe.coords || 'weatherOneLine' in wfe.coords || 'weatherCurrent' in wfe.coords || 'weatherDay' in wfe.coords || 'weatherNight' in wfe.coords || 'weatherAirText' in wfe.coords))
                        wfe.coords.weather = false;
                } else
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
                break;
            }
        case 'weatherDayAlt':
            {
                if ('weatherDayAlt' in wfe.coords)
                    delete wfe.coords.weatherDayAlt;
                else {
                    if (!(wfe.coords.weather) || !('weatherDay' in wfe.coords)) {
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
                }
                break;
            }
        case 'weatherNightAlt':
            {
                if ('weatherNightAlt' in wfe.coords)
                    delete wfe.coords.weatherNightAlt;
                else {
                    if (!(wfe.coords.weather) || !('weatherNight' in wfe.coords)) {
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
                }
                break;
            }
        case 'stepsGoal':
            {
                if (!(wfe.coords.stepsprogress))
                    wfe.coords.stepsprogress = true;
                if ('stepsGoal' in wfe.coords) {
                    delete wfe.coords.stepsGoal;
                    if (!('stepsLinear' in wfe.coords || 'stepsGoal' in wfe.coords || 'stepscircle' in wfe.coords))
                        wfe.coords.stepsprogress = false;
                } else
                    wfe.coords.stepsGoal = {
                        X: 0,
                        Y: 0,
                        ImageIndex: 266
                    };
                break;
            }
        case 'stepsLinear':
            {
                if (!(wfe.coords.stepsprogress))
                    wfe.coords.stepsprogress = true;
                if ('stepsLinear' in wfe.coords) {
                    delete wfe.coords.stepsLinear;
                    if (!('stepsLinear' in wfe.coords || 'stepsGoal' in wfe.coords || 'stepscircle' in wfe.coords))
                        wfe.coords.stepsprogress = false;
                } else
                    wfe.coords.stepsLinear = {
                        StartImageIndex: 200,
                        Segments: [{
                                X: 50,
                                Y: 160
                            },
                            {
                                X: 60,
                                Y: 160
                            },
                            {
                                X: 70,
                                Y: 160
                            },
                            {
                                X: 80,
                                Y: 160
                            },
                            {
                                X: 90,
                                Y: 160
                            },
                            {
                                X: 100,
                                Y: 160
                            },
                            {
                                X: 110,
                                Y: 160
                            },
                            {
                                X: 120,
                                Y: 160
                            }
                        ]
                    };
                break;
            }
        default:
            console.error('Error in toggle: ', el);
    }
    updatecode();
    select(toggleElements[el]);
}

function select(s) {
    let target = findspan(s);
    if (!target) return 0;
    let rng, sel;
    rng = document.createRange();
    rng.selectNode(target.childNodes[0]);
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(rng);
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
        UIkit.notification(('jsonupdate' in wfe.app.lang ? wfe.app.lang.jsonupdate : "To update pre.just click out of JSON input"), {
            status: 'primary',
            pos: 'top-left',
            timeout: 3000
        });
        wfe.app.firstopen_editor = false;
    }
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        let cls = 'number';
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
}

function checkDef(show) {
    let defImagesList = Array();
    for (let i = 0; i < $('watchface').childNodes.length; i++)
        if ($('watchface').childNodes[i].classList.contains('default-image'))
            defImagesList.push($('watchface').childNodes[i].src.slice(-7, -4));
    defImagesList.sort();
    for (let i = defImagesList.length - 1; i > 0; i--) {
        if (defImagesList[i] === defImagesList[i - 1]) defImagesList.splice(i, 1);
    }
    if (show && defImagesList.length)
        UIkit.notification(('checkImages' in wfe.app.lang ? wfe.app.lang.checkImages : "Check images in watchface folder. At least images with index(s): ") + defImagesList, {
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
            notify('imagesLimitSteps' in wfe.app.lang ? wfe.app.lang.imagesLimitSteps : "Image limit for steps progress is 20. If you use more, they won't be dispaly");
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
        setTimeout(function() {
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

let buttons = document.getElementsByClassName('editor-button');
let click_toggle = e => {
    toggle(e.target.id.split('-')[1]);
};
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', click_toggle);
}