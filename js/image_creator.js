/* global saveAs, UIkit, JSZip */
function addScript(url) {
    let e = document.createElement("script");
    e.src = url;
    e.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(e);
}
let edgeBrowser = navigator.userAgent.search(/Edge/u) > 0 || navigator.userAgent.search(/Firefox/u) > 0;
if (edgeBrowser) {
    addScript("js/canvas-toBlob.js");
}

let $ = el => document.getElementById(el);

$('fontfile').onchange = function() {
    if (this.files.length) {
        let reader = new FileReader();
        reader.onloadend = function() {
            document.getElementsByTagName("style")[1].textContent = "@font-face{font-family: 'customfont';src: url('" + reader.result + "');}";
        };
        reader.readAsDataURL(this.files[0]);
    }
};

class Creator {
    constructor() {
        this.color = '#000000';
        this.bg_color = '#FFFFFF';
        this.font = 'Share Tech Mono';
        this.height = 0;
        this.width = 0;
        this.heightChanged = false;
        this.widthChanged = false;
        this.topOffsetChanged = false;
        this.topOffset = 0;
        this.number = 0;
        this.numberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.wordsArray = [];
        this.array = [];
        this.rad = document.getElementsByName('color');
        this.radbg = document.getElementsByName('bgcolor');
        this.fonts = document.getElementsByName('fontfamily');
        this.limit = 127;
    }

    update() {
        let images = $("images"),
            hidden_images = $("hidden-images");
        hidden_images.innerHTML = '';
        images.innerHTML = '';
        this.wordsArray = $("text").value.split(",");
        if (this.wordsArray[0])
            this.array = this.wordsArray;
        else
            this.array = this.numberArray;
        for (let i = 0; i < this.array.length; i++) {
            hidden_images.innerHTML += '<div class="imagecover" style="font-size:' + $("textsize").value + 'px; color:' + this.color + ';background:' + this.bg_color + '" id="hidden-image-' + i + '"><span class="spanimage" style="top:' + this.topOffset + 'px">' + this.array[i] + '</span></div>';
        }
        hidden_images.style.fontFamily = this.font;
        if (!this.heightChanged) {
            this.height = 0;
            for (let i = 0; i < this.array.length; i++)
                if ($('hidden-image-' + i).offsetHeight > this.height)
                    this.height = $('hidden-image-' + i).offsetHeight;
            $("imageheight").value = this.height;
        }
        for (let i = 0; i < this.array.length; i++)
            $('hidden-image-' + i).style.height = this.height + 'px';
        if (!this.widthChanged) {
            this.width = 0;
            for (let i = 0; i < this.array.length; i++)
                if ($('hidden-image-' + i).offsetWidth > this.width)
                    this.width = $('hidden-image-' + i).offsetWidth;
            $("imagewidth").value = this.width;
        }
        for (let i = 0; i < this.array.length; i++)
            $('hidden-image-' + i).style.width = this.width + 'px';
        for (let el = 0; el < this.array.length; el++) {
            let canvas = document.createElement("canvas");
            canvas.id = 'canvas-image-' + el;
            canvas.width = this.width;
            canvas.height = this.height;
            let ctx = canvas.getContext("2d");
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.fillStyle = this.bg_color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = $("textsize").value + "px " + this.font;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = this.color;
            ctx.fillText($('hidden-image-' + el).innerText, canvas.width / 2, canvas.height / 2 + Number(this.topOffset));
            let imageDataFiltered = this.cleaner(ctx.getImageData(0, 0, canvas.width, canvas.height));
            ctx.putImageData(imageDataFiltered, 0, 0);
            images.appendChild(canvas);
        }
    }

    heightChange() {
        if ($("imageheight").value) {
            this.heightChanged = true;
            this.height = $("imageheight").value;
        } else {
            this.heightChanged = false;
        }
        this.update();
    }

    topOffsetChange() {
        if ($("imageoffset").value) {
            this.topOffsetChanged = true;
            this.topOffset = $("imageoffset").value;
        } else {
            this.topOffsetChanged = false;
        }
        this.update();
    }

    widthChange() {
        if ($("imagewidth").value) {
            this.widthChanged = true;
            this.width = $("imagewidth").value;
        } else {
            this.widthChanged = false;
        }
        this.update();
    }

    colorLimitChange() {
        if ($("color_limit").value) {
            this.limit = $("color_limit").value;
        } else {
            this.limit = 127;
            $("color_limit").value = 127;
        }
        this.update();
    }

    save() {
        let zip = new JSZip();
        this.number = Number($("imageindex").value);
        for (let el = 0; el < this.array.length; el++) {
            let canvas = $('canvas-image-' + el);
            zip.file(this.number + '.png', canvas.toDataURL("image/png").replace(/^data:image\/[a-z]+;base64,/u, ""), {base64: true});
            this.number += 1;
        }
        zip.generateAsync({type: "blob"}).
            then(content => {
                saveAs(content, "images.zip");
            });
    }

    cleaner(imageData) {
        let pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i],
                g = pixels[i + 1],
                b = pixels[i + 2];
            pixels[i] = (r > this.limit ? 255 : 0);
            pixels[i + 1] = (g > this.limit ? 255 : 0);
            pixels[i + 2] = (b > this.limit ? 255 : 0);
            // pixels[i + 3] = (pixels[i + 3] > 127 ? 255 : 0);
        }
        return imageData;
    }
}

let creator = new Creator();

let radio_button_bg = () => {
        for (let j = 0; j < creator.radbg.length; j++)
            if (creator.radbg[j].checked)
                creator.bg_color = creator.radbg[j].value;
        creator.update();
    },
    radio_button_fg = () => {
        for (let j = 0; j < creator.rad.length; j++)
            if (creator.rad[j].checked)
                creator.color = creator.rad[j].value;
        creator.update();
    },
    radio_button_font = () => {
        for (let j = 0; j < creator.fonts.length; j++)
            if (creator.fonts[j].checked)
                creator.font = creator.fonts[j].value;
        creator.update();
    };
for (let i = 0; i < creator.radbg.length; i++)
    creator.radbg[i].onchange = radio_button_bg;
for (let i = 0; i < creator.rad.length; i++)
    creator.rad[i].onchange = radio_button_fg;
for (let i = 0; i < creator.fonts.length; i++)
    creator.fonts[i].onchange = radio_button_font;

creator.update();

let app_lang = {};
/**
 * Downloads language json and applys it to app_lang
 *
 * @param {string} lang language name
 * @returns {null} null
 */
function changeLang(lang) {
    fetch('assets/translation_ic/' + lang + '.json').
        then(response => (response.status === 200 ? response : null)).
        then(response => response.json()).
        then(translation => {
            app_lang = translation;
            let strings = document.querySelectorAll('[data-translate-id]');
            for (let i = 0; i < strings.length; i++) {
                if (strings[i].dataset.translateId in app_lang)
                    if (strings[i].dataset.link)
                        strings[i].innerHTML = app_lang[strings[i].dataset.translateId].replace(/\$link/gu, strings[i].dataset.link);
                    else
                        strings[i].innerHTML = app_lang[strings[i].dataset.translateId];
            }
        }).
        catch(error => {
            console.warn("Loading translation error", error);
            UIkit.notification('<b>Loading translation error: </b>' + error, {
                status: 'danger',
                pos: 'top-left',
                timeout: 5000
            });
        });
}
if (!('lang' in localStorage))
    localStorage.lang = navigator.language || navigator.userLanguage;
if (localStorage.lang.indexOf("ru") >= 0) {
    changeLang('russian');
} else
if (localStorage.lang.indexOf("zh") >= 0) {
    changeLang('chinese');
} else
if (localStorage.lang.indexOf("it") >= 0) {
    changeLang('italian');
} else
if (localStorage.lang.indexOf("tr") >= 0) {
    changeLang('turkish');
}
if (localStorage.lang.indexOf("cs") >= 0) {
    changeLang('czech');
}
$('lang-ru').addEventListener('click', () => {
    localStorage.lang = 'ru';
    changeLang('russian');
});
$('lang-en').addEventListener('click', () => {
    localStorage.lang = 'en';
    changeLang('english');
});
$('lang-zh').addEventListener('click', () => {
    localStorage.lang = 'zh';
    changeLang('chinese');
});
$('lang-tr').addEventListener('click', () => {
    localStorage.lang = 'tr';
    changeLang('turkish');
});
$('lang-cs').addEventListener('click', () => {
    localStorage.lang = 'cs';
    changeLang('czech');
});

$('textsize').addEventListener('change', creator.update.bind(creator));
$('text').addEventListener('change', creator.update.bind(creator));
$('imageheight').addEventListener('change', creator.heightChange.bind(creator));
$('imagewidth').addEventListener('change', creator.widthChange.bind(creator));
$('imageoffset').addEventListener('change', creator.topOffsetChange.bind(creator));
$('color_limit').addEventListener('change', creator.colorLimitChange.bind(creator));
$('download').addEventListener('click', creator.save.bind(creator));

function install_metric(alt = false) {
    let link = alt ? 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js' : 'https://mc.yandex.ru/metrika/tag.js';

    (function(m, e, t, r, i, k, a) {
        m[i] = m[i] || function() {
            (m[i].a = m[i].a || []).push(arguments)
        };
        m[i].l = 1 * new Date();
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })
    (window, document, "script", link, "ym");

    ym(46845507, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
    });
}

(() => {
    install_metric();
    setTimeout(function() {
        if (typeof Ya === 'undefined')
            install_metric(true);
    }, 10000);
})();
