/* global UIkit */
const warning = () => {
    let date = new Date();
    let time = date.getTime();
    if (window.last_time) {
        if (time - 1000 * 30 - window.last_time < 0)
            return;
    }
    window.last_time = time;
    UIkit.notification("watchfaceEditor for Amazfit GTR is in development. Be careful if you use it!", {
        status: 'danger',
        pos: 'top-left',
        timeout: 7500
    });
};

let wf_data = {
    import: function(json) {
        warning();
        let data = {};
        if ('Background' in json)
            data.bg = json.Background;
        if ('Time' in json) {
            data.time = json.Time;
            if ('Seconds' in json.Time) {
                data.seconds = json.Time.Seconds;
                Reflect.deleteProperty(data.time, 'Seconds');
            }
            if ('AmPm' in json.Time) {
                data.amPm = json.Time.AmPm;
                Reflect.deleteProperty(data.time, 'AmPm');
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
                    Reflect.deleteProperty(data.monthandday, 'Separate');
                }
                if ('OneLine' in json.Date.MonthAndDay) {
                    data.dateOneLine = json.Date.MonthAndDay.OneLine;
                    Reflect.deleteProperty(data.monthandday, 'OneLine');
                }
            }
        } else
            data.date = false;
        if ('Battery' in json) {
            data.battery = true;
            if ('Images' in json.Battery)
                data.batteryIcon = json.Battery.Images;
            if ('Text' in json.Battery)
                data.batteryText = json.Battery.Text;
            if ('Scale' in json.Battery)
                data.batteryScale = json.Battery.Scale;
        } else
            data.battery = false;
        if ('Status' in json) {
            data.status = true;
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
            if ('Calories' in json.Activity)
                data.actCal = {Number: json.Activity.Calories};
            if ('Steps' in json.Activity)
                data.actSteps = {Number: json.Activity.Steps.Step};
            if ('StepsGoal' in json.Activity)
                data.actStepsGoal = {Number: json.Activity.StepsGoal};
            if ('Pulse' in json.Activity)
                data.actPulse = {Number: json.Activity.Pulse};
            if ('Distance' in json.Activity)
                data.actDistance = json.Activity.Distance;
            if ('StarImage' in json.Activity)
                data.stepsGoal = json.Activity.StarImage;
        } else
            data.activity = false;
        data.weather = false;
        if ('StepsProgress' in json) {
            data.stepsprogress = true;
            if ('Circle' in json.StepsProgress)
                data.stepscircle = json.StepsProgress.Circle;
            if ('Linear' in json.StepsProgress)
                data.stepsLinear = json.StepsProgress.Linear;
        } else
            data.stepsprogress = false;
        if ('AnalogDialFace' in json) {
            data.analog = true;
            if ('Hours' in json.AnalogDialFace)
                data.analoghours_image = json.AnalogDialFace.Hours.CenterImage;
            if ('Minutes' in json.AnalogDialFace)
                data.analogminutes_image = json.AnalogDialFace.Minutes.CenterImage;
            if ('Seconds' in json.AnalogDialFace)
                data.analogseconds_image = json.AnalogDialFace.Seconds.CenterImage;
        } else
            data.analog = false;
        return data;
    },
    export: function(data) {
        let obj = JSON.parse(JSON.stringify(data));
        let packed = {};
        if ('bg' in obj)
            packed.Background = obj.bg;
        if ('time' in obj) {
            packed.Time = obj.time;
            if ('seconds' in obj)
                packed.Time.Seconds = obj.seconds;
            if ('amPm' in obj)
                packed.Time.AmPm = obj.amPm;
        }
        if (obj.date) {
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
        }
        if (obj.status) {
            packed.Status = {};
            if ('statAlarm' in obj)
                packed.Status.Alarm = obj.statAlarm;
            if ('statBt' in obj)
                packed.Status.Bluetooth = obj.statBt;
            if ('statDnd' in obj)
                packed.Status.DoNotDisturb = obj.statDnd;
            if ('statLock' in obj)
                packed.Status.Lock = obj.statLock;
        }
        if (obj.battery) {
            packed.Battery = {};
            if ('batteryIcon' in obj)
                packed.Battery.Images = obj.batteryIcon;
            if ('batteryText' in obj)
                packed.Battery.Text = obj.batteryText;
            if ('batteryScale' in obj)
                packed.Battery.Scale = obj.batteryScale;
        }
        if (obj.activity) {
            packed.Activity = {};
            if ('actCal' in obj)
                packed.Activity.Calories = obj.actCal.Number;
            if ('actSteps' in obj)
                packed.Activity.Steps = {Step: obj.actSteps.Number};
            if ('actStepsGoal' in obj)
                packed.Activity.StepsGoal = obj.actStepsGoal.Number;
            if ('actPulse' in obj)
                packed.Activity.Pulse = obj.actPulse.Number;
            if ('actDistance' in obj)
                packed.Activity.Distance = obj.actDistance;
            if ('stepsGoal' in obj)
                packed.Activity.StarImage = obj.stepsGoal;
        }
        if (obj.stepsprogress) {
            packed.StepsProgress = {};
            if ('stepscircle' in obj)
                packed.StepsProgress.Circle = obj.stepscircle;
            if ('stepsLinear' in obj)
                packed.StepsProgress.Linear = obj.stepsLinear;
            if ('stepsGoal' in obj)
                packed.StepsProgress.GoalImage = obj.stepsGoal;
        }
        if (obj.analog) {
            packed.AnalogDialFace = {};
            if ('analoghours_image' in obj) {
                packed.AnalogDialFace.Hours = JSON.parse('{"unknown1":0,"unknown2":0,"unknown3":{"X":0,"Y":0},"unknown4":{"X":0,"Y":0},"CenterImage":{"X":38,"Y":227,"ImageIndex":42}}');
                packed.AnalogDialFace.Hours.CenterImage = obj.analoghours;
            }
            if ('analogminutes_image' in obj) {
                packed.AnalogDialFace.Minutes = JSON.parse('{"unknown1":0,"unknown2":0,"unknown3":{"X":0,"Y":0},"unknown4":{"X":0,"Y":0},"CenterImage":{"X":38,"Y":227,"ImageIndex":42}}');
                packed.AnalogDialFace.Minutes.CenterImage = obj.analogminutes;
            }
            if ('analogseconds_image' in obj) {
                packed.AnalogDialFace.Seconds = JSON.parse('{"unknown1":0,"unknown2":0,"unknown3":{"X":0,"Y":0},"unknown4":{"X":0,"Y":0},"CenterImage":{"X":38,"Y":227,"ImageIndex":42}}');
                packed.AnalogDialFace.Seconds.CenterImage = obj.analogseconds;
            }
        }
        return packed;
    }
};

let device = {
    height: 454,
    width: 454,
    editor_zoom: 1,
    preview_zoom: 0.5,
    tabs: ['editor-tab', 'jsonEditor-tab', 'resources-tab'],
    images: {
        watchface_block: {
            left: 69,
            top: 157,
            height: 752 - 157,
            width: 591 - 69,
            image: 'gtr.png'
        }
    },
    data: wf_data,
    default_coords: JSON.parse('{"bg":{"Image":{"ImageIndex":302,"X":0,"Y":0}},"time":{"Hours":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":186,"Y":194},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":148,"Y":194}},"Minutes":{"Ones":{"ImageIndex":255,"ImagesCount":10,"X":275,"Y":194},"Tens":{"ImageIndex":255,"ImagesCount":10,"X":238,"Y":194}}},"date":false,"battery":false,"status":false,"activity":false,"weather":false,"stepsprogress":false,"analog":false}')
};
export default device;