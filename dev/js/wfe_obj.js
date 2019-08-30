// import updateWatchface from "./watchface_react";

let defaultCoords = {
    number: function() {
        return JSON.parse(defaultCoords.numberJson);
    },
    numberJson: `{
        "TopLeftX": 0,
        "TopLeftY": 0,
        "BottomRightX": 15,
        "BottomRightY": 9,
        "Alignment": "TopLeft",
        "Spacing": 2,
        "ImageIndex": 200,
        "ImagesCount": 10
    }`
};

let wfe = {
    view: {},
    // _coords: {},
    // get coords() {
    //     return this._coords;
    // },
    // set coords(value) {
    //     this._coords = value;
    // },
    coords: {},
    coordsHistory: [],
    data: {
        time: {
            hours: '20',
            minutes: '38'
        },
        seconds: 43,
        date: {
            weekDay: 2,
            day: 6,
            month: 12
        },
        battery: 20,
        calories: 860,
        steps: 5687,
        stepsGoal: 12000,
        distance: [5, 67],
        pulse: 72,
        weatherDay: 22,
        weatherNight: 24,
        weathericon: 1,
        air: 300,
        alarm: true,
        bluetooth: true,
        dnd: true,
        lock: true,
        jsset: false,
        imagesset: false,
        wfname: 'watchface',
        weatherAlt: false,
        animation: 1
    },
    converter: null
};
wfe.elements = {
    timeHoursTens: {
        name: 'Time hours tens',
        editorId: 'e_time_ht',
        coords: () => wfe.coords.time.Hours.Tens
    },
    timeHoursOnes: {
        name: 'Time hours ones',
        editorId: 'e_time_ho',
        coords: () => wfe.coords.time.Hours.Ones
    },
    timeMinutesTens: {
        name: 'Time minutes tens',
        editorId: 'e_time_mt',
        coords: () => wfe.coords.time.Minutes.Tens
    },
    timeMinutesOnes: {
        name: 'Time minutes ones',
        editorId: 'e_time_mo',
        coords: () => wfe.coords.time.Minutes.Ones
    },
    timeSecondsTens: {
        name: 'Time seconds tens',
        editorId: 'e_time_st',
        coords: () => wfe.coords.seconds.Tens
    },
    timeSecondsOnes: {
        name: 'Time seconds ones',
        editorId: 'e_time_so',
        coords: () => wfe.coords.seconds.Ones
    },
    amPm: {
        name: 'AM/PM',
        editorId: 'e_time_am',
        coords: () => wfe.coords.amPm,
        defaultCoords: () => JSON.parse(`{
            "X": 0,
            "Y": 0,
            "ImageIndexAm": 233,
            "ImageIndexPm": 234
        }`)
    },
    dateWeekday: {
        name: 'Weekday',
        editorId: 'e_date_weekDay',
        coords: () => wfe.coords.dateWeekday,
        defaultCoords: () => JSON.parse(`{
            "X": 0,
            "Y": 0,
            "ImageIndex": 210,
            "ImagesCount": 7
        }`)
    },
    dateDay: {
        name: 'Day',
        editorId: 'e_date_sep_day',
        coords: () => wfe.coords.dateDay,
        defaultCoords: () => defaultCoords.number(),
        require: ['monthAndDate']
    },
    dateMonth: {
        name: 'Month',
        editorId: 'e_date_sep_month',
        coords: () => wfe.coords.dateMonth,
        defaultCoords: () => defaultCoords.number(),
        require: ['monthAndDate']
    },
    dateOneLine: {
        name: 'Date in one line',
        editorId: 'e_date_oneline',
        coords: () => wfe.coords.dateOneLine.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `,
            "DelimiterImageIndex": 219
        }`),
        require: ['monthAndDate']
    },
    actCalories: {
        name: 'Calories',
        editorId: 'e_act_cal',
        coords: () => wfe.coords.actCalories.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `
        }`)
    },
    actSteps: {
        name: 'Steps',
        editorId: 'e_act_steps',
        coords: () => wfe.coords.actSteps.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `
        }`)
    },
    actStepsGoal: {
        name: 'Steps goal',
        editorId: 'e_act_stepsGoal',
        coords: () => wfe.coords.actStepsGoal.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `
        }`)
    },
    actPulse: {
        name: 'Pulse',
        editorId: 'e_act_pulse',
        coords: () => wfe.coords.actPulse.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `
        }`)
    },
    actDistance: {
        name: 'Distance',
        editorId: 'e_act_distance',
        coords: () => wfe.coords.actDistance.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `,
            "SuffixImageIndex": 231,
            "DecimalPointImageIndex": 232
        }`)
    },
    batteryIcon: {
        name: 'Battery icon',
        editorId: 'e_battery_icon',
        coords: () => wfe.coords.batteryIcon,
        defaultCoords: () => JSON.parse(`{
            "X": 0,
            "Y": 0,
            "ImageIndex": 225,
            "ImagesCount": 6
        }`)
    },
    batteryText: {
        name: 'Battery text',
        editorId: 'e_battery_text',
        coords: () => wfe.coords.batteryText,
        defaultCoords: () => defaultCoords.number()
    },
    batteryScale: {
        name: 'Battery text',
        editorId: 'e_battery_scale',
        coords: () => wfe.coords.batteryScale,
        defaultCoords: () => JSON.parse(`{
            "StartImageIndex": 200,
            "Segments": [{
                "X": 55,
                "Y": 0
            }, {
                "X": 65,
                "Y": 0
            }, {
                "X": 75,
                "Y": 0
            }, {
                "X": 85,
                "Y": 0
            }, {
                "X": 95,
                "Y": 0
            }, {
                "X": 105,
                "Y": 0
            }, {
                "X": 115,
                "Y": 0
            }]
        }`)
    },
    stepsLinear: {
        name: 'Steps linear',
        editorId: 'e_steps_linear',
        coords: () => wfe.coords.stepsLinear,
        defaultCoords: () => JSON.parse(`{
            "StartImageIndex": 200,
            "Segments": [{
                "X": 50,
                "Y": 160
            }, {
                "X": 60,
                "Y": 160
            }, {
                "X": 70,
                "Y": 160
            }, {
                "X": 80,
                "Y": 160
            }, {
                "X": 90,
                "Y": 160
            }, {
                "X": 100,
                "Y": 160
            }, {
                "X": 110,
                "Y": 160
            }, {
                "X": 120,
                "Y": 160
            }]
        }`)
    },
    statAlarm: {
        name: 'Alarm',
        editorId: 'e_stat_alarm',
        coords: () => wfe.coords.statAlarm.Coordinates,
        defaultCoords: () => JSON.parse(`{
            "Coordinates": {
                "X": 0,
                "Y": 0
            },
            "ImageIndexOn": 224
        }`)
    },
    statBluetooth: {
        name: 'Bluetooth',
        editorId: 'e_stat_bt',
        coords: () => wfe.coords.statBluetooth.Coordinates,
        defaultCoords: () => JSON.parse(`{
            "Coordinates": {
                "X": 0,
                "Y": 0
            },
            "ImageIndexOn": 220,
            "ImageIndexOff": 221
        }`)
    },
    statDnd: {
        name: 'Do not distrurb',
        editorId: 'e_stat_dnd',
        coords: () => wfe.coords.statDnd.Coordinates,
        defaultCoords: () => JSON.parse(`{
            "Coordinates": {
                "X": 0,
                "Y": 0
            },
            "ImageIndexOn": 222
        }`)
    },
    statLock: {
        name: 'Lock',
        editorId: 'e_stat_lock',
        coords: () => wfe.coords.statLock.Coordinates,
        defaultCoords: () => JSON.parse(`{
            "Coordinates": {
                "X": 0,
                "Y": 0
            },
            "ImageIndexOn": 223
        }`)
    },
    weatherIcon: {
        name: 'Weather icon',
        editorId: 'e_weather_icon',
        coords: () => wfe.coords.weathericon.CustomIcon
    },
    weatherOneLine: {
        name: 'Weather in one line',
        editorId: 'e_weather_temp_today_oneline',
        coords: () => wfe.coords.weatherOneLine.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `,
            "MinusSignImageIndex": 217,
            "DelimiterImageIndex": 219,
            "AppendDegreesForBoth": false,
            "DegreesImageIndex": 218
        }`)
    },
    weatherDay: {
        name: 'Weather day',
        editorId: 'e_weather_temp_today_sep_day',
        coords: () => wfe.coords.weatherDay.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `,
            "MinusSignImageIndex": 217,
            "DegreesImageIndex": 218
        }`)
    },
    weatherNight: {
        name: 'Weather night',
        editorId: 'e_weather_temp_today_sep_night',
        coords: () => wfe.coords.weatherNight.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `,
            "MinusSignImageIndex": 217,
            "DegreesImageIndex": 218
        }`)
    },
    weatherDayAlt: {
        name: 'Weather day alt',
        editorId: 'e_weather_temp_today_sep_day_alt',
        coords: () => wfe.coords.weatherDayAlt.Number
    },
    weatherNightAlt: {
        name: 'Weather night alt',
        editorId: 'e_weather_temp_today_sep_night_alt',
        coords: () => wfe.coords.weatherNightAlt.Number
    },
    weatherCurrent: {
        name: 'Current weather',
        editorId: 'e_weather_temp_current',
        coords: () => wfe.coords.weatherCurrent.Number,
        defaultCoords: () => JSON.parse(`{
            "Number": ` + defaultCoords.numberJson + `,
            "MinusSignImageIndex": 217,
            "DegreesImageIndex": 218
        }`)
    },
    weatherAirIcon: {
        name: 'Air quality icon',
        editorId: 'e_weather_air_icon',
        coords: () => wfe.coords.weatherAirIcon,
        defaultCoords: () => JSON.parse(`{
            "X": 0,
            "Y": 0,
            "ImageIndex": 235,
            "ImagesCount": 6
        }`)
    },
    weatherAirText: {
        name: 'Air quality',
        editorId: 'e_weather_air_text',
        coords: () => wfe.coords.weatherAirText,
        defaultCoords: () => defaultCoords.number()
    },
    stepsGoal: {
        name: 'Steps goal',
        editorId: 'e_steps_goal',
        coords: () => wfe.coords.stepsGoal,
        defaultCoords: () => JSON.parse(`{
            "X": 0,
            "Y": 0,
            "ImageIndex": 266
        }`)
    },
    Animation: {
        name: 'Animation',
        editorId: 'e_animation',
        coords: () => wfe.coords.Animation.AnimationImage
    },
    stepscircle: {
        name: 'Steps Circle',
        editorId: 'e_steps_circle',
        coords: () => wfe.coords.stepscircle,
        defaultCoords: () => JSON.parse(`{
            "CenterX": 88,
            "CenterY": 88,
            "RadiusX": 24,
            "RadiusY": 24,
            "StartAngle": 0,
            "EndAngle": 360,
            "Width": 3,
            "Color": "0x00FF00"
        }`)
    }
};
window.wfe = wfe;
export default wfe;