/* global UIkit */
import {
    $ as $
} from './utils.js';
import devices from './devices/devices_list';

function change_device(name, wfe_obj) {
    localStorage.device = name;
    let device = devices[name];
    $('watchface').style.height = device.height + 'px';
    $('watchface').style.width = device.width + 'px';
    $('svg-cont-steps').attributes.height.value = device.height;
    $('svg-cont-steps').attributes.width.value = device.width;
    $('svg-cont-clock').attributes.height.value = device.height;
    $('svg-cont-clock').attributes.width.value = device.width;
    $('svg-cont-steps').style.width = device.width + 'px';
    $('editor').style.height = device.height * 3 + 'px';
    $('editor').style.width = device.width * 3 + 'px';
    $('analog').style.height = device.height * 3 + 'px';
    $('analog').style.width = device.width * 3 + 'px';
    $('watchfaceimage').style.background = 'url(assets/' + device.images.watchface_block.image + ')';
    $('watchfaceimage').style.paddingLeft = device.images.watchface_block.left + 'px';
    $('watchfaceimage').style.paddingTop = device.images.watchface_block.top + 'px';
    $('watchfaceimage').style.height = device.images.watchface_block.height + 'px';
    $('watchfaceimage').style.width = device.images.watchface_block.width + 'px';
    wfe_obj.default_coords = device.default_coords;
    wfe_obj.converter = device.data;
    for (let i = 0, elements = $('.main-tab'); i < elements.length; i++) {
        if (device.tabs.includes(elements[i].id)) {
            elements[i].removeAttribute('hidden');
        } else {
            elements[i].setAttribute('hidden', '');
        }
    }
    wfe_obj.device = {
        name: name,
        height: device.height,
        width: device.width
    };
}

let app_lang = {};

function changeLang(lang) {
    try {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'assets/translation/' + lang + '.json', false);
        xhr.send();
        if (xhr.status === 200) {
            app_lang = JSON.parse(xhr.responseText);
            let strings = document.querySelectorAll('[data-translate-id]');
            for (let i = 0; i < strings.length; i++) {
                if (strings[i].dataset.translateId in app_lang)
                    if (strings[i].dataset.link === undefined)
                        strings[i].innerHTML = app_lang[strings[i].dataset.translateId];
                    else
                        strings[i].innerHTML = app_lang[strings[i].dataset.translateId].replace(/\$link/g, strings[i].dataset.link);
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
}

function changeTheme(theme) {
    if (localStorage.appTheme === 'amazfit') {
        $('.uk-navbar-left')[0].innerHTML = '<a class="uk-navbar-item uk-logo we-white" href="https://v1ack.github.io/watchfaceEditor/"><img src="assets/icon/android-chrome-192x192.png" style="width: auto; height: 60%; margin-right: 10px;">Watchface Editor</a>';
        $('<html')[0].style.background = '';
        $('.uk-navbar')[0].style.height = '';
        $('.uk-navbar')[0].classList.add('we-white');
        $('.uk-navbar')[0].classList.remove('amazfit');
        $('.uk-navbar-container')[0].style.background = 'linear-gradient(to left, #28a5f5, #1e87f0)';
        $('menu-amazfit').setAttribute('hidden', '');
        $('tablist-amazfit').setAttribute('hidden', '');
        $('tablist').removeAttribute('hidden');
        $('donate-link').removeAttribute('hidden');
        $('theme-settings').removeAttribute('hidden');
    }
    switch (theme) {
        case 'light':
            localStorage.appTheme = 'light';
            document.body.classList.remove('uk-light');
            $('<html')[0].classList.remove('uk-background-secondary');
            $('vars').classList.remove('uk-card-secondary');
            $('modal-howto').childNodes[1].classList.remove('uk-background-secondary');
            $('modal-about').childNodes[1].classList.remove('uk-background-secondary');
            $('modal-donate').childNodes[1].classList.remove('uk-background-secondary');
            $('jsonerrormodal').childNodes[1].classList.remove('uk-background-secondary');
            $('modal-preview').childNodes[1].classList.remove('uk-background-secondary');
            $('modal-settings').childNodes[1].classList.remove('uk-background-secondary');
            break;
        case 'dark':
            localStorage.appTheme = 'dark';
            document.body.classList.add('uk-light');
            $('<html')[0].classList.add('uk-background-secondary');
            $('vars').classList.add('uk-card-secondary');
            $('modal-howto').childNodes[1].classList.add('uk-background-secondary');
            $('modal-about').childNodes[1].classList.add('uk-background-secondary');
            $('modal-donate').childNodes[1].classList.add('uk-background-secondary');
            $('jsonerrormodal').childNodes[1].classList.add('uk-background-secondary');
            $('modal-preview').childNodes[1].classList.add('uk-background-secondary');
            $('modal-settings').childNodes[1].classList.add('uk-background-secondary');
            break;
        case 'amazfit':
            changeTheme('dark');
            $('.uk-navbar-left')[0].innerHTML = '<a class="uk-navbar-item uk-logo we-white" href="https://amazfitwatchfaces.com/"><img src="assets/logo.png" style="width: 200px; image-rendering: auto;"></a>';
            localStorage.appTheme = 'amazfit';
            $('<html')[0].style.background = '#121314';
            $('.uk-navbar')[0].style.height = '50px';
            $('.uk-navbar')[0].classList.remove('we-white');
            $('.uk-navbar')[0].classList.add('amazfit');
            $('.uk-navbar-container')[0].style.background = '#222';
            $('menu-amazfit').removeAttribute('hidden');
            $('tablist-amazfit').removeAttribute('hidden');
            $('tablist').setAttribute('hidden', '');
            $('donate-link').setAttribute('hidden', '');
            $('theme-settings').setAttribute('hidden', '');
            break;
    }
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
$('lang-de').addEventListener('click', () => {
    localStorage.lang = 'de';
    changeLang('german');
});
$('lang-nl').addEventListener('click', () => {
    localStorage.lang = 'nl';
    changeLang('dutch');
});
$('lang-tr').addEventListener('click', () => {
    localStorage.lang = 'tr';
    changeLang('turkish');
});
$('theme-light').addEventListener('click', () => changeTheme('light'));
$('theme-dark').addEventListener('click', () => changeTheme('dark'));

export default {
    changeLang: changeLang,
    changeTheme: changeTheme,
    change_device: change_device
};