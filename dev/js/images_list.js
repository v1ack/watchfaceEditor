/* global UIkit */
import {$} from './utils.js';
import wfe from './wfe_obj.js';

/**
 * Translated string with fallback
 *
 * @param {string} key translation key
 * @param {string} fallback english text
 * @returns {string} text
 */
function t(key, fallback) {
    return wfe.language && key in wfe.language ? wfe.language[key] : fallback;
}

/**
 * Image id from file name: "12.png" -> "12", "weather.png" -> "weather"
 *
 * @param {string} name file name
 * @returns {string|null} id or null if file name is not supported
 */
function imageId(name) {
    let base = name.replace(/\.png$/iu, '');
    if (base.toLowerCase() === 'weather')
        return 'weather';
    if (base !== '' && !isNaN(Number(base)))
        return String(Number(base));
    return null;
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function loadedImages() {
    return Array.from($('allimages').getElementsByTagName('img'));
}

function findImage(id) {
    return loadedImages().find(img => img.id === id) || null;
}

/**
 * Puts image into #allimages, replacing an image with the same id
 * #allimages goes before #defimages in DOM, so loaded images override default ones
 *
 * @param {string} id image id
 * @param {string} url data url
 * @returns {Promise} resolves when image is loaded
 */
function setImage(id, url) {
    return new Promise(resolve => {
        let img = document.createElement('img');
        img.onload = resolve;
        img.onerror = resolve;
        img.id = id;
        img.src = url;
        let old = findImage(id);
        if (old)
            old.parentNode.replaceChild(img, old);
        else
            $('allimages').appendChild(img);
    });
}

function compareIds(a, b) {
    let na = Number(a.id),
        nb = Number(b.id);
    if (isNaN(na) && isNaN(nb)) return a.id.localeCompare(b.id);
    if (isNaN(na)) return 1;
    if (isNaN(nb)) return -1;
    return na - nb;
}

function updateSelectButton() {
    let button = $('inputimages').nextElementSibling;
    if (loadedImages().length) {
        button.classList.remove('uk-button-danger');
        button.classList.add('uk-button-default', 'uk-label-success');
    } else
        button.classList.remove('uk-label-success');
}

function redraw() {
    if (wfe.makeWf && wfe.coords && Object.keys(wfe.coords).length)
        wfe.makeWf();
}

/**
 * Renders list of loaded images
 *
 * @returns {undefined}
 */
function render() {
    let images = loadedImages().sort(compareIds),
        list = $('imageslist');
    wfe.data.imagesset = images.length > 0;
    updateSelectButton();
    if (wfe.data.imagesset && wfe.data.jsset && wfe.load)
        wfe.load.disableBtn(1);
    $('imageslist-count').textContent = images.length ? '(' + images.length + ')' : '';
    $('imageslist-clear').disabled = !images.length;
    list.innerHTML = '';
    if (!images.length) {
        let empty = document.createElement('div');
        empty.className = 'uk-text-meta';
        empty.textContent = t('imagesListEmpty', 'No images loaded');
        list.appendChild(empty);
        return;
    }
    images.forEach(img => {
        let row = document.createElement('div'),
            preview = document.createElement('img'),
            label = document.createElement('span'),
            size = document.createElement('span'),
            replace = document.createElement('button'),
            remove = document.createElement('button');
        row.className = 'imageslist-row';
        preview.src = img.src;
        preview.className = 'imageslist-preview';
        label.className = 'imageslist-name';
        label.textContent = img.id + '.png';
        size.className = 'uk-text-meta imageslist-size';
        size.textContent = img.naturalWidth + '×' + img.naturalHeight;
        replace.type = 'button';
        replace.className = 'uk-button uk-button-default uk-button-small';
        replace.textContent = t('imageReplace', 'Replace');
        replace.addEventListener('click', () => pickFile(false, files => replaceImage(img.id, files[0])));
        remove.type = 'button';
        remove.className = 'uk-button uk-button-danger uk-button-small';
        remove.textContent = t('imageDelete', 'Delete');
        remove.addEventListener('click', () => removeImage(img.id));
        row.append(preview, label, size, replace, remove);
        list.appendChild(row);
    });
}

/**
 * Opens file dialog
 *
 * @param {boolean} multiple allow multiple files
 * @param {function} callback receives FileList
 * @returns {undefined}
 */
function pickFile(multiple, callback) {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png';
    input.multiple = multiple;
    input.addEventListener('change', () => {
        if (input.files.length)
            callback(input.files);
    });
    input.click();
}

/**
 * Adds images to loaded ones. Image with the same name is replaced
 *
 * @param {FileList|Array} files png files
 * @returns {Promise} resolves when all images are loaded
 */
function addFiles(files) {
    let skipped = [],
        jobs = [];
    Array.from(files).forEach(file => {
        let id = imageId(file.name);
        if (id === null)
            skipped.push(file.name);
        else
            jobs.push(readFile(file).then(url => setImage(id, url)));
    });
    if (skipped.length)
        UIkit.notification(t('imagesSkipped', 'Skipped files (name must be a number or weather.png): ') + skipped.join(', '), {
            status: 'warning',
            pos: 'top-left',
            timeout: 5000
        });
    return Promise.all(jobs).then(() => {
        render();
        redraw();
    });
}

/**
 * Replaces image keeping its index
 *
 * @param {string} id image id
 * @param {File} file new png file
 * @returns {Promise} resolves when image is loaded
 */
function replaceImage(id, file) {
    return readFile(file).then(url => setImage(id, url)).then(() => {
        render();
        redraw();
    });
}

function removeImage(id) {
    let img = findImage(id);
    if (img)
        img.parentNode.removeChild(img);
    render();
    redraw();
}

function removeAll() {
    $('allimages').innerHTML = '';
    $('inputimages').value = '';
    render();
    redraw();
}

$('imageslist-add').addEventListener('click', () => pickFile(true, addFiles));
$('imageslist-clear').addEventListener('click', removeAll);
document.addEventListener('wfe-langchange', render);
render();

export default {
    addFiles: addFiles,
    removeAll: removeAll,
    render: render
};
