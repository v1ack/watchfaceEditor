/* global UIkit */
const warning = () => {
    UIkit.notification("watchfaceEditor for Mi Band 4 is in development. Be careful if you use it!", {
        status: 'danger',
        pos: 'top-left',
        timeout: 7500
    });
};
const copy = e => JSON.parse(JSON.stringify(e));
let wf_data = {
    import: function(json) {
        let data = {};
        if ('Background' in json)
            data.bg = json.Background;
        if ('Time' in json) {
            data.time = json.Time;
            if ('Seconds' in json.Time) {
                data.seconds = json.Time.Seconds;
                delete data.time.Seconds;
            }
        }
        if ('Date' in json) {
            data.date = true;
            if ('WeekDay' in json.Date)
                data.weekDay = json.Date.WeekDay;
            if ('MonthAndDay' in json.Date) {
                data.monthandday = json.Date.MonthAndDay;
                if ('Separate' in json.Date.MonthAndDay) {
                    if ('Day' in json.Date.MonthAndDay.Separate)
                        data.dateDay = json.Date.MonthAndDay.Separate.Day;
                    if ('Month' in json.Date.MonthAndDay.Separate)
                        data.dateMonth = json.Date.MonthAndDay.Separate.Month;
                    delete data.monthandday.Separate;
                }
                if ('OneLine' in json.Date.MonthAndDay) {
                    data.dateOneLine = json.Date.MonthAndDay.OneLine;
                    delete data.monthandday.OneLine;
                }
            }
            if ('DayAmPm' in json.Date) {
                data.amPm = {
                    X: json.Date.DayAmPm.TopLeftX,
                    Y: json.Date.DayAmPm.TopLeftY,
                    ImageIndexAm: json.Date.DayAmPm.ImageIndexAMEN,
                    ImageIndexPm: json.Date.DayAmPm.ImageIndexPMEN
                };
            }
        } else
            data.date = false;
        if ('Status' in json) {
            data.status = true;
            if ('Battery' in json.Status) {
                data.battery = true;
                if ('BatteryConfig' in json.Status.Battery)
                    data.BatteryConfig = json.Status.Battery.BatteryConfig;
                if ('Icon' in json.Status.Battery)
                    data.batteryIcon = json.Status.Battery.Icon;
                if ('Text' in json.Status.Battery)
                    data.batteryText = json.Status.Battery.Text;
                if ('Scale' in json.Status.Battery)
                    data.batteryScale = json.Status.Battery.Scale;
            } else
                data.battery = false;
            if ('Alarm' in json.Status)
                data.statAlarm = json.Status.Alarm;
            if ('Bluetooth' in json.Status)
                data.statBt = json.Status.Bluetooth;
            if ('DoNotDisturb' in json.Status)
                data.statDnd = json.Status.DoNotDisturb;
            if ('Lock' in json.Status)
                data.statLock = json.Status.Lock;
        } else
            data.status = false;
        if ('Activity' in json) {
            data.activity = true;
            if ('Calories' in json.Activity) {
                data.actCal = json.Activity.Calories.Number;
                delete json.Activity.Calories.Number;
                data.actCal.cor = json.Activity.Calories;
            }
            if ('Steps' in json.Activity) {
                data.actSteps = json.Activity.Steps.Step;
                delete json.Activity.Steps.Step;
                data.actSteps.cor = json.Activity.Steps;
            }
            if ('StepsGoal' in json.Activity) {
                data.actStepsGoal = json.Activity.StepsGoal.Number;
                delete json.Activity.StepsGoal.Number;
                data.actStepsGoal.cor = json.Activity.StepsGoal;
            }
            if ('Pulse' in json.Activity) {
                data.actPulse = json.Activity.Pulse.Pulse;
                delete json.Activity.Pulse.Pulse;
                data.actPulse.cor = json.Activity.Pulse;
            }
            if ('Distance' in json.Activity)
                data.actDistance = json.Activity.Distance;
        } else
            data.activity = false;
        // if ('Weather' in json) {
        //     data.weather = true;
        //     if ('Icon' in json.Weather)
        //         data.weathericon = json.Weather.Icon;
        //     if ('Temperature' in json.Weather) {
        //         if ('Today' in json.Weather.Temperature) {
        //             if ('OneLine' in json.Weather.Temperature.Today)
        //                 data.weatherOneLine = json.Weather.Temperature.Today.OneLine;
        //             if ('Separate' in json.Weather.Temperature.Today) {
        //                 if ('Day' in json.Weather.Temperature.Today.Separate)
        //                     data.weatherDay = json.Weather.Temperature.Today.Separate.Day;
        //                 if ('Night' in json.Weather.Temperature.Today.Separate)
        //                     data.weatherNight = json.Weather.Temperature.Today.Separate.Night;
        //                 if ('DayAlt' in json.Weather.Temperature.Today.Separate) {
        //                     data.weatherDayAlt = JSON.parse(JSON.stringify(json.Weather.Temperature.Today.Separate.Day));
        //                     data.weatherDayAlt.Number.BottomRightX = data.weatherDayAlt.Number.BottomRightX - data.weatherDayAlt.Number.TopLeftX + json.Weather.Temperature.Today.Separate.DayAlt.X;
        //                     data.weatherDayAlt.Number.BottomRightY = data.weatherDayAlt.Number.BottomRightY - data.weatherDayAlt.Number.TopLeftY + json.Weather.Temperature.Today.Separate.DayAlt.Y;
        //                     data.weatherDayAlt.Number.TopLeftX = json.Weather.Temperature.Today.Separate.DayAlt.X;
        //                     data.weatherDayAlt.Number.TopLeftY = json.Weather.Temperature.Today.Separate.DayAlt.Y;
        //                 }
        //                 if ('NightAlt' in json.Weather.Temperature.Today.Separate) {
        //                     data.weatherNightAlt = JSON.parse(JSON.stringify(json.Weather.Temperature.Today.Separate.Night));
        //                     data.weatherNightAlt.Number.BottomRightX = data.weatherNightAlt.Number.BottomRightX - data.weatherNightAlt.Number.TopLeftX + json.Weather.Temperature.Today.Separate.NightAlt.X;
        //                     data.weatherNightAlt.Number.BottomRightY = data.weatherNightAlt.Number.BottomRightY - data.weatherNightAlt.Number.TopLeftY + json.Weather.Temperature.Today.Separate.NightAlt.Y;
        //                     data.weatherNightAlt.Number.TopLeftX = json.Weather.Temperature.Today.Separate.NightAlt.X;
        //                     data.weatherNightAlt.Number.TopLeftY = json.Weather.Temperature.Today.Separate.NightAlt.Y;
        //                 }
        //             }
        //         }
        //         if ('Current' in json.Weather.Temperature)
        //             data.weatherCurrent = json.Weather.Temperature.Current;
        //     }
        //     if ('AirPollution' in json.Weather) {
        //         if ('Icon' in json.Weather.AirPollution)
        //             data.weatherAirIcon = json.Weather.AirPollution.Icon;
        //         if ('Index' in json.Weather.AirPollution)
        //             data.weatherAirText = json.Weather.AirPollution.Index;
        //     }
        // } else
        //     data.weather = false;
        if ('StepsProgress' in json) {
            data.stepsprogress = true;
            if ('Circle' in json.StepsProgress)
                data.stepscircle = json.StepsProgress.Circle;
            if ('Linear' in json.StepsProgress)
                data.stepsLinear = json.StepsProgress.Linear;
            if ('GoalImage' in json.StepsProgress)
                data.stepsGoal = json.StepsProgress.GoalImage;
        } else
            data.stepsprogress = false;
        // if ('AnalogDialFace' in json) {
        //     data.analog = true;
        //     if ('Hours' in json.AnalogDialFace)
        //         data.analoghours = json.AnalogDialFace.Hours;
        //     if ('Minutes' in json.AnalogDialFace)
        //         data.analogminutes = json.AnalogDialFace.Minutes;
        //     if ('Seconds' in json.AnalogDialFace)
        //         data.analogseconds = json.AnalogDialFace.Seconds;
        // } else
        //     data.analog = false;
        if ('Other' in json) {
            if ('Animation' in json.Other) {
                data.Animation = json.Other.Animation;
            }
        }
        return data;
    },
    export: function(data) {
        warning();
        let obj = copy(data);
        let packed = {};
        if ('bg' in obj)
            packed.Background = obj.bg;
        if ('time' in obj) {
            packed.Time = obj.time;
            if ('seconds' in obj)
                packed.Time.Seconds = obj.seconds;
        }
        if (obj.date || 'amPm' in obj) {
            packed.Date = {};
            if ('weekDay' in obj)
                packed.Date.WeekDay = obj.weekDay;
            if ('monthandday' in obj) {
                packed.Date.MonthAndDay = obj.monthandday;
                if ('dateDay' in obj || 'dateMonth' in obj) {
                    packed.Date.MonthAndDay.Separate = {};
                    if ('dateDay' in obj)
                        packed.Date.MonthAndDay.Separate.Day = obj.dateDay;
                    if ('dateMonth' in obj)
                        packed.Date.MonthAndDay.Separate.Month = obj.dateMonth;
                }
                if ('dateOneLine' in obj)
                    packed.Date.MonthAndDay.OneLine = obj.dateOneLine;
            }
            if ('amPm' in obj)
                packed.Date.DayAmPm = {
                    TopLeftX: obj.amPm.X,
                    TopLeftY: obj.amPm.Y,
                    ImageIndexAMCN: obj.amPm.ImageIndexAm,
                    ImageIndexPMCN: obj.amPm.ImageIndexPm,
                    ImageIndexAMEN: obj.amPm.ImageIndexAm,
                    ImageIndexPMEN: obj.amPm.ImageIndexPm
                };
        }
        if (obj.status || obj.battery) {
            packed.Status = {};
            if (obj.battery) {
                packed.Status.Battery = {};
                if ('BatteryConfig' in obj)
                    packed.Status.Battery.Icon = obj.BatteryConfig;
                if ('batteryIcon' in obj)
                    packed.Status.Battery.Icon = obj.batteryIcon;
                if ('batteryText' in obj)
                    packed.Status.Battery.Text = obj.batteryText;
                if ('batteryScale' in obj)
                    packed.Status.Battery.Scale = obj.batteryScale;
            }
            if ('statAlarm' in obj)
                packed.Status.Alarm = obj.statAlarm;
            if ('statBt' in obj)
                packed.Status.Bluetooth = obj.statBt;
            if ('statDnd' in obj)
                packed.Status.DoNotDisturb = obj.statDnd;
            if ('statLock' in obj)
                packed.Status.Lock = obj.statLock;
        }
        if (obj.activity) {
            packed.Activity = {};
            if ('actCal' in obj) {
                packed.Activity.Calories = obj.actCal.cor;
                packed.Activity.Calories.Number = obj.actCal;
                delete packed.Activity.Calories.Number.cor;
            }
            if ('actSteps' in obj) {
                packed.Activity.Steps = obj.actSteps.cor;
                packed.Activity.Steps.Step = obj.actSteps;
                delete packed.Activity.Steps.Step.cor;
            }
            if ('actStepsGoal' in obj) {
                packed.Activity.StepsGoal = obj.actStepsGoal.cor;
                packed.Activity.StepsGoal.Number = obj.actStepsGoal;
                delete packed.Activity.StepsGoal.Number.cor;
            }
            if ('actPulse' in obj) {
                packed.Activity.Pulse = obj.actPulse.cor;
                packed.Activity.Pulse.Pulse = obj.actPulse;
                delete packed.Activity.Pulse.Pulse.cor;
            }
            if ('actDistance' in obj)
                packed.Activity.Distance = obj.actDistance;
        }
        // if (obj.weather) {
        //     packed.Weather = {};
        //     if ('weathericon' in obj)
        //         packed.Weather.Icon = obj.weathericon;
        //     if ('weatherCurrent' in obj || 'weatherDay' in obj || 'weatherNight' in obj || 'weatherOneLine' in obj) {
        //         packed.Weather.Temperature = {};
        //         if ('weatherDay' in obj || 'weatherNight' in obj || 'weatherOneLine' in obj) {
        //             packed.Weather.Temperature.Today = {};
        //             if ('weatherOneLine' in obj)
        //                 packed.Weather.Temperature.Today.OneLine = obj.weatherOneLine;
        //             if ('weatherDay' in obj || 'weatherNight' in obj) {
        //                 packed.Weather.Temperature.Today.Separate = {};
        //                 if ('weatherDay' in obj)
        //                     packed.Weather.Temperature.Today.Separate.Day = obj.weatherDay;
        //                 if ('weatherNight' in obj)
        //                     packed.Weather.Temperature.Today.Separate.Night = obj.weatherNight;
        //                 if ('weatherDayAlt' in obj) {
        //                     packed.Weather.Temperature.Today.Separate.DayAlt = {};
        //                     packed.Weather.Temperature.Today.Separate.DayAlt.X = obj.weatherDayAlt.Number.TopLeftX;
        //                     packed.Weather.Temperature.Today.Separate.DayAlt.Y = obj.weatherDayAlt.Number.TopLeftY;
        //                 }
        //                 if ('weatherNightAlt' in obj) {
        //                     packed.Weather.Temperature.Today.Separate.NightAlt = {};
        //                     packed.Weather.Temperature.Today.Separate.NightAlt.X = obj.weatherNightAlt.Number.TopLeftX;
        //                     packed.Weather.Temperature.Today.Separate.NightAlt.Y = obj.weatherNightAlt.Number.TopLeftY;
        //                 }
        //             }
        //         }
        //         if ('weatherCurrent' in obj)
        //             packed.Weather.Temperature.Current = obj.weatherCurrent;
        //     }
        //     if ('weatherAirIcon' in obj || 'weatherAirText' in obj) {
        //         packed.Weather.AirPollution = {};
        //         if ('weatherAirIcon' in obj)
        //             packed.Weather.AirPollution.Icon = obj.weatherAirIcon;
        //         if ('weatherAirText' in obj)
        //             packed.Weather.AirPollution.Index = obj.weatherAirText;
        //     }
        // }
        if (obj.stepsprogress) {
            packed.StepsProgress = {};
            if ('stepscircle' in obj)
                packed.StepsProgress.Circle = obj.stepscircle;
            if ('stepsLinear' in obj)
                packed.StepsProgress.Linear = obj.stepsLinear;
            if ('stepsGoal' in obj)
                packed.StepsProgress.GoalImage = obj.stepsGoal;
        }
        // if (obj.analog) {
        //     packed.AnalogDialFace = {};
        //     if ('analoghours' in obj)
        //         packed.AnalogDialFace.Hours = obj.analoghours;
        //     if ('analogminutes' in obj)
        //         packed.AnalogDialFace.Minutes = obj.analogminutes;
        //     if ('analogseconds' in obj)
        //         packed.AnalogDialFace.Seconds = obj.analogseconds;
        // }
        if (obj.Animation) {
            packed.Other = {};
            packed.Other.Animation = obj.Animation;
        }
        return packed;
    }
};

let device = {
    height: 240,
    width: 120,
    tabs: ['editor-tab', 'jsonEditor-tab', 'resources-tab'],
    images: {
        watchface_block: {
            left: 31,
            top: 108,
            height: 402,
            width: 154,
            image: 'b4.png'
        }
    },
    data: wf_data,
    default_coords: JSON.parse('{"bg":{"Image":{"ImageIndex":301,"X":0,"Y":0}},"time":{"Hours":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":68,"Y":26},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":23,"Y":26}},"Minutes":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":69,"Y":132},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":24,"Y":132}}},"date":false,"battery":false,"status":false,"activity":false,"weather":false,"stepsprogress":false,"analog":false}')
};
export default device;