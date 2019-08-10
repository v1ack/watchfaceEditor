let wfe = {
    view: {},
    coords: {},
    coordsHistory: [],
    data: {
        timeOnClock: ["20", "38"],
        seconds: [4, 3],
        analog: [259, 228, 60],
        weekDay: 2,
        day: 6,
        month: 12,
        battery: 20,
        calories: 860,
        steps: 5687,
        stepsGoal: 12000,
        distance: [5, 67],
        pulse: 72,
        temp: [22, 24],
        weathericon: 0,
        air: 300,
        alarm: true,
        bluetooth: true,
        dnd: true,
        lock: true,
        jsset: false,
        imagesset: false,
        wfname: 'watchface',
        weatherAlt: false,
        animation: 0
    },
    converter: null
};
wfe.elements = {
    timeHoursTens: {
        name: 'Time hours tens',
        editorId: 'e_time_ht',
        prewiewClass: 'c_time',
        coords: function() {
            return wfe.coords.time.Hours.Tens;
        },
        drawFunc: function() {
            wfe.draw.time.time();
        }
    },
    timeHoursOnes: {
        name: 'Time hours ones',
        editorId: 'e_time_ho',
        prewiewClass: 'c_time',
        coords: function() {
            return wfe.coords.time.Hours.Ones;
        },
        drawFunc: function() {
            wfe.draw.time.time();
        }
    },
    timeMinutesTens: {
        name: 'Time minutes tens',
        editorId: 'e_time_mt',
        prewiewClass: 'c_time',
        coords: function() {
            return wfe.coords.time.Minutes.Tens;
        },
        drawFunc: function() {
            wfe.draw.time.time();
        }
    },
    timeMinutesOnes: {
        name: 'Time minutes ones',
        editorId: 'e_time_mo',
        prewiewClass: 'c_time',
        coords: function() {
            return wfe.coords.time.Minutes.Ones;
        },
        drawFunc: function() {
            wfe.draw.time.time();
        }
    },
    timeSecondsTens: {
        name: 'Time seconds tens',
        editorId: 'e_time_st',
        prewiewClass: 'c_sec',
        coords: function() {
            return wfe.coords.seconds.Tens;
        },
        drawFunc: function() {
            wfe.draw.time.seconds();
        }
    },
    timeSecondsOnes: {
        name: 'Time seconds ones',
        editorId: 'e_time_so',
        prewiewClass: 'c_sec',
        coords: function() {
            return wfe.coords.seconds.Ones;
        },
        drawFunc: function() {
            wfe.draw.time.seconds();
        }
    },
    timeM: {
        name: 'AM/PM',
        editorId: 'e_time_am',
        prewiewClass: 'c_time_am',
        coords: function() {
            return wfe.coords.amPm;
        },
        drawFunc: function() {
            wfe.draw.time.time();
        }
    },
    dateWeekday: {
        name: 'Weekday',
        editorId: 'e_date_weekDay',
        prewiewClass: 'c_date_weekDay',
        coords: function() {
            return wfe.coords.weekDay;
        },
        drawFunc: function() {
            wfe.draw.date.weekDay();
        }
    },
    dateDay: {
        name: 'Day',
        editorId: 'e_date_sep_day',
        prewiewClass: 'c_date_sepday',
        coords: function() {
            return wfe.coords.dateDay;
        },
        drawFunc: function() {
            wfe.draw.date.sepday();
        }
    },
    dateMonth: {
        name: 'Month',
        editorId: 'e_date_sep_month',
        prewiewClass: 'c_date_sepmonth',
        coords: function() {
            return wfe.coords.dateMonth;
        },
        drawFunc: function() {
            wfe.draw.date.sepmonth();
        }
    },
    dateOneLine: {
        name: 'Date in one line',
        editorId: 'e_date_oneline',
        prewiewClass: 'c_date_oneline',
        coords: function() {
            return wfe.coords.dateOneLine.Number;
        },
        drawFunc: function() {
            wfe.draw.date.oneline();
        }
    },
    actCalories: {
        name: 'Calories',
        editorId: 'e_act_cal',
        prewiewClass: 'c_act_cal',
        coords: function() {
            return wfe.coords.actCal;
        },
        drawFunc: function() {
            wfe.draw.activity.cal();
        }
    },
    actSteps: {
        name: 'Steps',
        editorId: 'e_act_steps',
        prewiewClass: 'c_act_steps',
        coords: function() {
            return wfe.coords.actSteps;
        },
        drawFunc: function() {
            wfe.draw.activity.steps();
        }
    },
    actStepsGoal: {
        name: 'Steps goal',
        editorId: 'e_act_stepsGoal',
        prewiewClass: 'c_act_stepsg',
        coords: function() {
            return wfe.coords.actStepsGoal;
        },
        drawFunc: function() {
            wfe.draw.activity.stepsGoal();
        }
    },
    actPulse: {
        name: 'Pulse',
        editorId: 'e_act_pulse',
        prewiewClass: 'c_act_pulse',
        coords: function() {
            return wfe.coords.actPulse;
        },
        drawFunc: function() {
            wfe.draw.activity.pulse();
        }
    },
    actDistance: {
        name: 'Distance',
        editorId: 'e_act_distance',
        prewiewClass: 'c_act_distance',
        coords: function() {
            return wfe.coords.actDistance.Number;
        },
        drawFunc: function() {
            wfe.draw.activity.distance();
        }
    },
    batteryIcon: {
        name: 'Battery icon',
        editorId: 'e_battery_icon',
        prewiewClass: 'c_battery_icon',
        coords: function() {
            return wfe.coords.batteryIcon;
        },
        drawFunc: function() {
            wfe.draw.battery.icon();
        }
    },
    batteryText: {
        name: 'Battery text',
        editorId: 'e_battery_text',
        prewiewClass: 'c_battery_text',
        coords: function() {
            return wfe.coords.batteryText;
        },
        drawFunc: function() {
            wfe.draw.battery.text();
        }
    },
    statAlarm: {
        name: 'Alarm',
        editorId: 'e_stat_alarm',
        prewiewClass: 'c_stat_alarm',
        coords: function() {
            return wfe.coords.statAlarm.Coordinates;
        },
        drawFunc: function() {
            wfe.draw.status.alarm();
        }
    },
    statBluetooth: {
        name: 'Bluetooth',
        editorId: 'e_stat_bt',
        prewiewClass: 'c_stat_bt',
        coords: function() {
            return wfe.coords.statBt.Coordinates;
        },
        drawFunc: function() {
            wfe.draw.status.bt();
        }
    },
    statDND: {
        name: 'Do not distrurb',
        editorId: 'e_stat_dnd',
        prewiewClass: 'c_stat_dnd',
        coords: function() {
            return wfe.coords.statDnd.Coordinates;
        },
        drawFunc: function() {
            wfe.draw.status.dnd();
        }
    },
    statLock: {
        name: 'Lock',
        editorId: 'e_stat_lock',
        prewiewClass: 'c_stat_lock',
        coords: function() {
            return wfe.coords.statLock.Coordinates;
        },
        drawFunc: function() {
            wfe.draw.status.lock();
        }
    },
    weatherIcon: {
        name: 'Weather icon',
        editorId: 'e_weather_icon',
        prewiewClass: 'c_weather_icon',
        coords: function() {
            return wfe.coords.weathericon.CustomIcon;
        },
        drawFunc: function() {
            wfe.draw.weather.icon();
        }
    },
    weatherOneLine: {
        name: 'Weather in one line',
        editorId: 'e_weather_temp_today_oneline',
        prewiewClass: 'c_temp_oneline',
        coords: function() {
            return wfe.coords.weatherOneLine.Number;
        },
        drawFunc: function() {
            wfe.draw.weather.temp.oneline();
        }
    },
    weatherDay: {
        name: 'Weather day',
        editorId: 'e_weather_temp_today_sep_day',
        prewiewClass: 'c_temp_sep_day',
        coords: function() {
            return wfe.coords.weatherDay.Number;
        },
        drawFunc: function() {
            wfe.draw.weather.temp.sep.day();
        }
    },
    weatherNight: {
        name: 'Weather night',
        editorId: 'e_weather_temp_today_sep_night',
        prewiewClass: 'c_temp_sep_night',
        coords: function() {
            return wfe.coords.weatherNight.Number;
        },
        drawFunc: function() {
            wfe.draw.weather.temp.sep.night();
        }
    },
    weatherDayAlt: {
        name: 'Weather day alt',
        editorId: 'e_weather_temp_today_sep_day_alt',
        prewiewClass: 'c_temp_sep_day_a',
        coords: function() {
            return wfe.coords.weatherDayAlt.Number;
        },
        drawFunc: function() {
            wfe.draw.weather.temp.sep.dayAlt();
        }
    },
    weatherNightAlt: {
        name: 'Weather night alt',
        editorId: 'e_weather_temp_today_sep_night_alt',
        prewiewClass: 'c_temp_sep_night_a',
        coords: function() {
            return wfe.coords.weatherNightAlt.Number;
        },
        drawFunc: function() {
            wfe.draw.weather.temp.sep.nightAlt();
        }
    },
    weatherCurrent: {
        name: 'Current weather',
        editorId: 'e_weather_temp_current',
        prewiewClass: 'c_temp_cur',
        coords: function() {
            return wfe.coords.weatherCurrent.Number;
        },
        drawFunc: function() {
            wfe.draw.weather.temp.current();
        }
    },
    weatherAirIcon: {
        name: 'Air quality icon',
        editorId: 'e_weather_air_icon',
        prewiewClass: 'c_air_icon',
        coords: function() {
            return wfe.coords.weatherAirIcon;
        },
        drawFunc: function() {
            wfe.draw.weather.airIcon();
        }
    },
    weatherAirText: {
        name: 'Air quality',
        editorId: 'e_weather_air_text',
        prewiewClass: 'c_air_text',
        coords: function() {
            return wfe.coords.weatherAirText;
        },
        drawFunc: function() {
            wfe.draw.weather.airText();
        }
    },
    stepsGoal: {
        name: 'Steps goal',
        editorId: 'e_steps_goal',
        prewiewClass: 'c_steps_goal',
        coords: function() {
            return wfe.coords.stepsGoal;
        },
        drawFunc: function() {
            wfe.draw.stepsprogress.goal();
        }
    },
    Animation: {
        name: 'Animation',
        editorId: 'e_animation',
        prewiewClass: 'c_animation',
        coords: function() {
            return wfe.coords.Animation.AnimationImage;
        },
        drawFunc: function() {
            wfe.draw.Animation();
        }
    }
};
//window.wfe = wfe;
export default wfe;