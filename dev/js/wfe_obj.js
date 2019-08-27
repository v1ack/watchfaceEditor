// import updateWatchface from "./watchface_react";

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
        coords: function() {
            return wfe.coords.time.Hours.Tens;
        }
    },
    timeHoursOnes: {
        name: 'Time hours ones',
        editorId: 'e_time_ho',
        coords: function() {
            return wfe.coords.time.Hours.Ones;
        }
    },
    timeMinutesTens: {
        name: 'Time minutes tens',
        editorId: 'e_time_mt',
        coords: function() {
            return wfe.coords.time.Minutes.Tens;
        }
    },
    timeMinutesOnes: {
        name: 'Time minutes ones',
        editorId: 'e_time_mo',
        coords: function() {
            return wfe.coords.time.Minutes.Ones;
        }
    },
    timeSecondsTens: {
        name: 'Time seconds tens',
        editorId: 'e_time_st',
        coords: function() {
            return wfe.coords.seconds.Tens;
        }
    },
    timeSecondsOnes: {
        name: 'Time seconds ones',
        editorId: 'e_time_so',
        coords: function() {
            return wfe.coords.seconds.Ones;
        }
    },
    timeM: {
        name: 'AM/PM',
        editorId: 'e_time_am',
        coords: function() {
            return wfe.coords.amPm;
        }
    },
    dateWeekday: {
        name: 'Weekday',
        editorId: 'e_date_weekDay',
        coords: function() {
            return wfe.coords.weekDay;
        }
    },
    dateDay: {
        name: 'Day',
        editorId: 'e_date_sep_day',
        coords: function() {
            return wfe.coords.dateDay;
        }
    },
    dateMonth: {
        name: 'Month',
        editorId: 'e_date_sep_month',
        coords: function() {
            return wfe.coords.dateMonth;
        }
    },
    dateOneLine: {
        name: 'Date in one line',
        editorId: 'e_date_oneline',
        coords: function() {
            return wfe.coords.dateOneLine.Number;
        }
    },
    actCalories: {
        name: 'Calories',
        editorId: 'e_act_cal',
        coords: function() {
            return wfe.coords.actCal.Number;
        }
    },
    actSteps: {
        name: 'Steps',
        editorId: 'e_act_steps',
        coords: function() {
            return wfe.coords.actSteps.Number;
        }
    },
    actStepsGoal: {
        name: 'Steps goal',
        editorId: 'e_act_stepsGoal',
        coords: function() {
            return wfe.coords.actStepsGoal.Number;
        }
    },
    actPulse: {
        name: 'Pulse',
        editorId: 'e_act_pulse',
        coords: function() {
            return wfe.coords.actPulse.Number;
        }
    },
    actDistance: {
        name: 'Distance',
        editorId: 'e_act_distance',
        coords: function() {
            return wfe.coords.actDistance.Number;
        }
    },
    batteryIcon: {
        name: 'Battery icon',
        editorId: 'e_battery_icon',
        coords: function() {
            return wfe.coords.batteryIcon;
        }
    },
    batteryText: {
        name: 'Battery text',
        editorId: 'e_battery_text',
        coords: function() {
            return wfe.coords.batteryText;
        }
    },
    statAlarm: {
        name: 'Alarm',
        editorId: 'e_stat_alarm',
        coords: function() {
            return wfe.coords.statAlarm.Coordinates;
        }
    },
    statBluetooth: {
        name: 'Bluetooth',
        editorId: 'e_stat_bt',
        coords: function() {
            return wfe.coords.statBt.Coordinates;
        }
    },
    statDND: {
        name: 'Do not distrurb',
        editorId: 'e_stat_dnd',
        coords: function() {
            return wfe.coords.statDnd.Coordinates;
        }
    },
    statLock: {
        name: 'Lock',
        editorId: 'e_stat_lock',
        coords: function() {
            return wfe.coords.statLock.Coordinates;
        }
    },
    weatherIcon: {
        name: 'Weather icon',
        editorId: 'e_weather_icon',
        coords: function() {
            return wfe.coords.weathericon.CustomIcon;
        }
    },
    weatherOneLine: {
        name: 'Weather in one line',
        editorId: 'e_weather_temp_today_oneline',
        coords: function() {
            return wfe.coords.weatherOneLine.Number;
        }
    },
    weatherDay: {
        name: 'Weather day',
        editorId: 'e_weather_temp_today_sep_day',
        coords: function() {
            return wfe.coords.weatherDay.Number;
        }
    },
    weatherNight: {
        name: 'Weather night',
        editorId: 'e_weather_temp_today_sep_night',
        coords: function() {
            return wfe.coords.weatherNight.Number;
        }
    },
    weatherDayAlt: {
        name: 'Weather day alt',
        editorId: 'e_weather_temp_today_sep_day_alt',
        coords: function() {
            return wfe.coords.weatherDayAlt.Number;
        }
    },
    weatherNightAlt: {
        name: 'Weather night alt',
        editorId: 'e_weather_temp_today_sep_night_alt',
        coords: function() {
            return wfe.coords.weatherNightAlt.Number;
        }
    },
    weatherCurrent: {
        name: 'Current weather',
        editorId: 'e_weather_temp_current',
        coords: function() {
            return wfe.coords.weatherCurrent.Number;
        }
    },
    weatherAirIcon: {
        name: 'Air quality icon',
        editorId: 'e_weather_air_icon',
        coords: function() {
            return wfe.coords.weatherAirIcon;
        }
    },
    weatherAirText: {
        name: 'Air quality',
        editorId: 'e_weather_air_text',
        coords: function() {
            return wfe.coords.weatherAirText;
        }
    },
    stepsGoal: {
        name: 'Steps goal',
        editorId: 'e_steps_goal',
        coords: function() {
            return wfe.coords.stepsGoal;
        }
    },
    Animation: {
        name: 'Animation',
        editorId: 'e_animation',
        coords: function() {
            return wfe.coords.Animation.AnimationImage;
        }
    },
    stepscircle: {
        name: 'Steps Circle',
        editorId: 'e_steps_circle',
        coords: function() {
            return wfe.coords.stepscircle;
        }
    }
};
window.wfe = wfe;
export default wfe;