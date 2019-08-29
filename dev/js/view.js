/* global saveAs, UIkit */
import {$} from './utils.js';
import wfe from './wfe_obj.js';
import html2canvas from 'html2canvas';
import updateWatchface from './watchface_react';

function makeWf() {
    try {
        updateWatchface();
    } catch (error) {
        console.warn(error);
        if (error.name === "ImageError") {
            UIkit.notification(('imagenotfound' in wfe.language ? wfe.language.imagenotfound : "Image with index $index not found").replace("$index", "<b>" + error.imageIndex + "</b>"), {
                timeout: 7500,
                status: 'danger',
                pos: 'top-left'
                
            });
        }
        if (error.name === "TypeError") {
            UIkit.notification("Image for prorety not found", {
                timeout: 7500,
                status: 'danger',
                pos: 'top-left'
            });
        }
    }
}

function cleaner(imageData) {
    let pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i],
            g = pixels[i + 1],
            b = pixels[i + 2];
        pixels[i] = (r > 127 ? 255 : 0);
        pixels[i + 1] = (g > 127 ? 255 : 0);
        pixels[i + 2] = (b > 127 ? 255 : 0);
    }
    return imageData;
}

function makepng() {
    let el = 'watchface';
    if ($('makepngwithwatch').checked)
        el = 'watchfaceimage';
    window.scrollTo(0, 0);
    html2canvas($(el), {
        allowTaint: true,
        scale: 1,
        useCORS: true,
        scrollY: 0,
        scrollX: -4
    }).then(canvas => {
        if (wfe.device.name === 'bip' && !($('makepngwithwatch').checked)) {
            let ctx = canvas.getContext('2d');
            ctx.putImageData(cleaner(ctx.getImageData(0, 0, canvas.width, canvas.height)), 0, 0);
        }
        if (wfe.app.notWebkitBased) {
            canvas.toBlob(function(blob) {
                saveAs(blob, wfe.data.wfname + '.png');
            });
        } else {
            let a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = wfe.data.wfname + '.png';
            a.click();
            a = null;
        }
    });
}

function makePreview() {
    window.scrollTo(0, 0);
    html2canvas($('watchfaceimage'), {
        allowTaint: true,
        scale: 1
    }).then(canvas => {
        $('realsizePreview').innerHTML = '';
        $('realsizePreview').appendChild(canvas);
        console.log('done');
    });
}

$('real_size_preview_button').addEventListener('click', makePreview);
$('makepng').addEventListener('click', makepng);

wfe.makeWf = makeWf;