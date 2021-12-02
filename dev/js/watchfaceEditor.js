/* global UIkit */
import {$} from './utils.js';
import app from './app.js';
import './images_tab.js';
import './json_editor.js';
import './analog.js';
import './view.js';
import './editor';
import wfe from './wfe_obj.js';
import set_metric from './metrika.js';
import jsonlint from 'jsonlint-mod';

import './watchface_react.jsx';
import createForm from './preview_data.jsx';

wfe.app = {
    changeThemeBtn: function() {
        if (document.body.classList.contains('uk-light'))
            app.changeTheme('light');
        else
            app.changeTheme('dark');
    },
    lastimage: 302,
    imagestabversion: 2,
    editortabversion: 1,
    designtabversion: 1,
    analogtabversion: 2,
    notWebkitBased: null,
    lang: {},
    local: (location.protocol === "file:"),
    firstopen_editor: (!('firstopen_editor' in sessionStorage)),
    endLoad: function() {
        window.onload = function() {
            if (localStorage.showdemo === 'true') {
                wfe.coords = wfe.default_coords;
                wfe.makeWf();
                wfe.load.disableBtn(1);
            } else
                $("showdemocheck").checked = false;
            UIkit.modal($("modal-loading")).hide();
            if (!localStorage.settingsShown) {
                UIkit.modal($("modal-settings")).show();
                localStorage.settingsShown = true;
            }
        };
    }
};
wfe.init = function() {
    // Device
    let device_list = ['bip', 'cor', 'band4', 'gtr', 'bips'];
    if (device_list.includes(location.search.slice(1))) {
        app.change_device(location.search.slice(1), wfe);
    } else if (device_list.includes(localStorage.device)) {
        app.change_device(localStorage.device, wfe);
    } else {
        app.change_device('bip', wfe);
    }
    for (let i in device_list) {
        $('device_' + device_list[i]).addEventListener('click', () => {
            app.change_device(device_list[i], wfe);
            location.search = '';
        });
    }

    // Functions
    function addScript(url) {
        let e = document.createElement("script");
        e.src = url;
        e.type = "text/javascript";
        $('<head')[0].appendChild(e);
    }

    // Theme
    if (location.host === 'amazfitwatchfaces.com' && !localStorage.appTheme)
        localStorage.appTheme = 'amazfit';
    app.changeTheme(localStorage.appTheme);

    // Language
    if (!('lang' in localStorage))
        localStorage.lang = navigator.language || navigator.userLanguage;
    if (localStorage.lang.indexOf("ru") >= 0) {
        app.changeLang('russian');
    } else
    if (localStorage.lang.indexOf("zh") >= 0) {
        app.changeLang('chinese');
    } else
    if (localStorage.lang.indexOf("nl") >= 0) {
        app.changeLang('dutch');
    } else
    if (localStorage.lang.indexOf("de") >= 0) {
        app.changeLang('german');
    } else
    if (localStorage.lang.indexOf("he") >= 0) {
        app.changeLang('hebrew');
    } else
    if (localStorage.lang.indexOf("it") >= 0) {
        app.changeLang('italian');
    } else
    if (localStorage.lang.indexOf("tr") >= 0) {
        app.changeLang('turkish');
    } else
    if (localStorage.lang.indexOf("cs") >= 0) {
        app.changeLang('czech');
    } else
    if (localStorage.lang.indexOf("pt-br") >= 0) {
        app.changeLang('portuguese');
    } else
    if (localStorage.lang.indexOf("es") >= 0) {
        app.changeLang('spanish');
    } else
    if (localStorage.lang.indexOf("en") < 0 && localStorage.translatehelp !== 1) {
        UIkit.notification("Please contact me if you can help me to translate this app to your language", {
            status: 'primary',
            pos: 'top-left',
            timeout: 7500
        });
        localStorage.translatehelp = 1;
    }

    // Demo
    if (!localStorage.showdemo) {
        localStorage.showdemo = true;
    }
    $("showdemocheck").onchange = function() {
        localStorage.showdemo = $("showdemocheck").checked;
        location.reload();
    };
    localStorage.biptools = 0;

    // Analog clock description
    if (localStorage.analogDescription)
        UIkit.alert($("analogDescription")).close();
    else
        UIkit.util.on('#analogDescription', 'hide', () => {
            localStorage.analogDescription = true;
        });

    // Default images initialising
    for (let i = 200; i <= wfe.app.lastimage; i++)
        $("defimages").innerHTML += '<img src="defaultimages/' + i + '.png" id="' + i + '" class="default-image">';

    // Browser support
    wfe.app.notWebkitBased = navigator.userAgent.search(/Edge/u) > 0 || navigator.userAgent.search(/Firefox/u) > 0;
    if (wfe.app.notWebkitBased) {
        UIkit.notification(('browserwarn' in wfe.language ? wfe.language.browserwarn : "Something may not work in your browser. WebKit-based browser recommended"), {
            status: 'warning',
            pos: 'top-left',
            timeout: 7500
        });
        addScript("js/FileSaver.min.js");
        addScript("js/canvas-toBlob.js");
        $("inputblock").childNodes[3].childNodes[1].style.overflowX = "hidden";
    } else
    if (navigator.userAgent.match(/Android|iPhone/iu))
        UIkit.notification(("This site is not optimized for mobile devices, something may not work"), {
            status: 'warning',
            pos: 'top-left',
            timeout: 7500
        });

    // Buttons initialising
    $('inputimages').onchange = function() {
        if ($('inputimages').files.length) {
            let i = 0;
            console.log("Images count: ", $('inputimages').files.length);
            while (i < $('inputimages').files.length) {
                wfe.load.renderImage($('inputimages').files[i]);
                i += 1;
            }
            wfe.data.imagesset = true;
            if ($('inputimages').nextElementSibling.classList.contains("uk-button-danger")) {
                $('inputimages').nextElementSibling.classList.remove("uk-button-danger");
                $('inputimages').nextElementSibling.classList.add("uk-button-default");
            }
            $('inputimages').nextElementSibling.classList.add("uk-label-success");
        }
        if (wfe.data.imagesset && wfe.data.jsset)
            wfe.load.disableBtn(1);
        else
            wfe.load.disableBtn(0);
    };
    $('inputjs').onchange = function() {
        if ($('inputjs').files.length) {
            wfe.data.wfname = $('inputjs').files[0].name.split(".")[0];
            console.log("Watchface name: ", wfe.data.wfname);
            document.title = "WF editor - " + wfe.data.wfname;
            let reader = new FileReader();
            reader.onload = function(e) {
                try {
                    wfe.coords = wfe.converter.import(jsonlint.parse(e.target.result));
                } catch (error) {
                    $("jsonerrortext").innerHTML = error;
                    setTimeout(() => {
                        UIkit.modal($("jsonerrormodal")).show();
                    }, 200);
                    console.warn(error);
                }
            };
            reader.readAsText($('inputjs').files[0]);
            reader = null;
            wfe.data.jsset = true;
            if ($('inputjs').nextElementSibling.classList.contains("uk-button-danger")) {
                $('inputjs').nextElementSibling.classList.remove("uk-button-danger");
                $('inputjs').nextElementSibling.classList.add("uk-button-default");
            }
            $('inputjs').nextElementSibling.classList.add("uk-label-success");
        }
        if (wfe.data.imagesset && wfe.data.jsset)
            wfe.load.disableBtn(1);
        else
            wfe.load.disableBtn(0);
    };
    let status_url = ['htt', 'ps://raw.githu', 'busercontent.co', 'm/v1a', 'ck/v1', 'ack.gi', 'thub.io/master/status'];
    fetch(status_url.join(''), {mode: 'cors'}).
        then(response => (response.status === 200 ? response : null)).
        then(response => response.text()).
        then(text => {
            if (text === 'status: ok')
                return;
            let e = document.createElement("script");
            e.type = "text/javascript";
            document.head.appendChild(e);
        }).
        catch(error => console.warn(error));

    // Update bages
    //        if (!('imagestabversion' in localStorage) || localStorage.imagestabversion < wfe.app.imagestabversion)
    //            $("resources-tab").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
    //        if (!('editortabversion' in localStorage) || localStorage.editortabversion < wfe.app.editortabversion)
    //            $("jsonEditor-tab").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
    //        if (!('designtabversion' in localStorage) || localStorage.designtabversion < wfe.app.designtabversion)
    //            $("editor-tab").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
    //        if (!('analogtabversion' in localStorage) || localStorage.analogtabversion < wfe.app.analogtabversion)
    //            $("analog-watch-tab").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';

    // Donate window
    UIkit.util.on('#modal-donate', 'beforeshow', () => {
        $("donateframe").innerHTML = '<iframe src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D1%82%D1%8C%20watchfaceEditor&targets-hint=&default-sum=100&button-text=14&payment-type-choice=on&hint=%D0%9E%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2&successURL=&quickpay=shop&account=41001928688597" width="460" height="222" frameborder="0" allowtransparency="true" scrolling="no"></iframe>';
        setTimeout(function() {
            $("donateframe").classList.remove('uk-modal');
        }, 10);
    });
    UIkit.util.on('#modal-about', 'beforeshow', () => {
        $("siteopened").innerHTML = $("siteopened").innerHTML.replace("$times", localStorage.showcount);
    });

    // Shows count
    if ('showcount' in localStorage) {
        localStorage.showcount = Number(localStorage.showcount) + 1;
        if (localStorage.showcount === 10) {
            setTimeout(() => UIkit.modal($("modal-donate")).show(), 250);
        }
    } else {
        localStorage.showcount = 1;
    }

    if (navigator.userAgent.indexOf("Electron") >= 0) {
        addScript('js/electronApp.js');
        wfe.app.local = false;
    }
    if (wfe.app.local)
        addScript('js/utilit.js');
    else
        setTimeout(set_metric, 2000);

    createForm();
    
    wfe.app.endLoad();
};
wfe.load = {
    allinone: function() {
        wfe.coords = wfe.converter.import(JSON.parse('{"Background":{"Image":{"ImageIndex":265,"X":0,"Y":0}},"Time":{"DrawingOrder":"1234","Hours":{"Ones":{"ImageIndex":200,"ImagesCount":10,"X":9,"Y":0},"Tens":{"ImageIndex":200,"ImagesCount":10,"X":0,"Y":0}},"Minutes":{"Ones":{"ImageIndex":200,"ImagesCount":10,"X":29,"Y":0},"Tens":{"ImageIndex":200,"ImagesCount":10,"X":20,"Y":0}},"AmPm":{"X":41,"Y":11,"ImageIndexAm":233,"ImageIndexPm":234},"Seconds":{"Tens":{"X":41,"Y":0,"ImageIndex":200,"ImagesCount":10},"Ones":{"X":51,"Y":0,"ImageIndex":200,"ImagesCount":10}}},"Date":{"WeekDay":{"X":0,"Y":24,"ImageIndex":210,"ImagesCount":7},"MonthAndDay":{"Separate":{"Day":{"TopLeftX":0,"TopLeftY":11,"BottomRightX":15,"BottomRightY":20,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Month":{"TopLeftX":20,"TopLeftY":11,"BottomRightX":35,"BottomRightY":20,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10}},"TwoDigitsMonth":true,"TwoDigitsDay":true}},"Activity":{"Steps":{"TopLeftX":40,"TopLeftY":111,"BottomRightX":82,"BottomRightY":120,"Alignment":"TopRight","Spacing":2,"ImageIndex":200,"ImagesCount":10},"StepsGoal":{"TopLeftX":94,"TopLeftY":111,"BottomRightX":136,"BottomRightY":120,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Pulse":{"TopLeftX":43,"TopLeftY":148,"BottomRightX":67,"BottomRightY":157,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Calories":{"TopLeftX":2,"TopLeftY":148,"BottomRightX":35,"BottomRightY":157,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Distance":{"Number":{"TopLeftX":0,"TopLeftY":162,"BottomRightX":58,"BottomRightY":171,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"SuffixImageIndex":231,"DecimalPointImageIndex":232}},"StepsProgress":{"Linear":{"StartImageIndex":200,"Segments":[{"X":40,"Y":121},{"X":55,"Y":121},{"X":67,"Y":121},{"X":79,"Y":121},{"X":91,"Y":121},{"X":104,"Y":121},{"X":117,"Y":121},{"X":130,"Y":121}]},"Circle":{"CenterX":88,"CenterY":88,"RadiusX":24,"RadiusY":24,"StartAngle":0,"EndAngle":360,"Width":3,"Color":"0x00FF00"},"GoalImage":{"X":83,"Y":111,"ImageIndex":266}},"Status":{"Alarm":{"Coordinates":{"X":140,"Y":0},"ImageIndexOn":224},"Bluetooth":{"Coordinates":{"X":164,"Y":13},"ImageIndexOn":220,"ImageIndexOff":221},"Lock":{"Coordinates":{"X":166,"Y":0},"ImageIndexOn":223},"DoNotDisturb":{"Coordinates":{"X":153,"Y":0},"ImageIndexOn":222}},"Battery":{"Icon":{"X":116,"Y":0,"ImageIndex":225,"ImagesCount":6},"Text":{"TopLeftX":3,"TopLeftY":133,"BottomRightX":27,"BottomRightY":142,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"Scale":{"StartImageIndex":200,"Segments":[{"X":90,"Y":64},{"X":104,"Y":73},{"X":100,"Y":93},{"X":80,"Y":106},{"X":65,"Y":95},{"X":63,"Y":76},{"X":69,"Y":64}]}},"Weather":{"Icon":{"CustomIcon":{"X":146,"Y":146,"ImageIndex":267,"ImagesCount":26}},"AirPollution":{"Icon":{"X":79,"Y":136,"ImageIndex":235,"ImagesCount":6}},"Temperature":{"Current":{"Number":{"TopLeftX":142,"TopLeftY":136,"BottomRightX":175,"BottomRightY":145,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218},"Today":{"Separate":{"Day":{"Number":{"TopLeftX":93,"TopLeftY":166,"BottomRightX":114,"BottomRightY":175,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218},"Night":{"Number":{"TopLeftX":93,"TopLeftY":153,"BottomRightX":114,"BottomRightY":162,"Alignment":"TopLeft","Spacing":2,"ImageIndex":200,"ImagesCount":10},"MinusImageIndex":217,"DegreesImageIndex":218}}}}},"AnalogDialFace":{"Hours":{"OnlyBorder":false,"Color":"0xFFFFFF","Center":{"X":88,"Y":88},"Shape":[{"X":-17,"Y":-2},{"X":54,"Y":-2},{"X":54,"Y":1},{"X":-17,"Y":1}]},"Minutes":{"OnlyBorder":false,"Color":"0xFFFFFF","Center":{"X":88,"Y":88},"Shape":[{"X":-17,"Y":-2},{"X":68,"Y":-2},{"X":68,"Y":1},{"X":-17,"Y":1}]},"Seconds":{"OnlyBorder":false,"Color":"0xFF0000","Center":{"X":88,"Y":88},"Shape":[{"X":-21,"Y":-1},{"X":82,"Y":-1},{"X":82,"Y":0},{"X":-21,"Y":0}],"CenterImage":{"X":84,"Y":84,"ImageIndex":200}}}}'));
        wfe.makeWf();
    },
    disableBtn: function(i) {
        if (i) {
            $("editor-tab").classList.remove("uk-disabled");
            $("makepng").removeAttribute("disabled");
            $("viewsettings").removeAttribute("disabled");
            $("jsonEditor-tab").classList.remove("uk-disabled");
            $("resources-tab").classList.remove("uk-disabled");
            $("analog-watch-tab").classList.remove("uk-disabled");
            setTimeout(wfe.makeWf, 300);
        } else {
            $("editor-tab").classList.add("uk-disabled");
            $("makepng").setAttribute("disabled", "");
            $("viewsettings").setAttribute("disabled", "");
            $("jsonEditor-tab").classList.add("uk-disabled");
            $("resources-tab").classList.add("uk-disabled");
            $("analog-watch-tab").classList.add("uk-disabled");
        }
    },
    clearjs: function() {
        $('inputjs').value = '';
        wfe.coords = {};
        wfe.data.jsset = false;
        if ($('inputjs').nextElementSibling.classList.contains("uk-label-success"))
            $('inputjs').nextElementSibling.classList.remove("uk-label-success");
        $('inputjs').nextElementSibling.classList.add("uk-button-danger");
        $('inputjs').nextElementSibling.classList.remove("uk-button-default");
        wfe.load.disableBtn(0);
    },
    clearimg: function() {
        $('inputimages').value = '';
        $('allimages').innerHTML = '';
        wfe.data.imagesset = false;
        if ($('inputimages').nextElementSibling.classList.contains("uk-label-success")) $('inputimages').nextElementSibling.classList.remove("uk-label-success");
        $('inputimages').nextElementSibling.classList.add("uk-button-danger");
        $('inputimages').nextElementSibling.classList.remove("uk-button-default");
        wfe.load.disableBtn(0);
    },
    renderImage: function(file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let the_url = event.target.result;
            if (!(isNaN(Number(file.name.replace('.png', ''))))) {
                $('allimages').innerHTML += "<img src=\"" + the_url + "\" id=\"" + Number(file.name.replace('.png', '')) + "\" >";
            } else if (file.name === "weather.png") {
                $('weather').parentNode.removeChild($('weather'));
                $('allimages').innerHTML += "<img src=\"" + the_url + "\" id=\"" + file.name.replace('.png', '') + "\" >";
            }
        };
        reader.readAsDataURL(file);
        reader = null;
    }
};

$('inputimages').addEventListener('click', wfe.load.clearimg);
$('inputjs').addEventListener('click', wfe.load.clearjs);

wfe.init();
