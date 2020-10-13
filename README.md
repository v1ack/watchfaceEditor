# WatchfaceEditor

[![](https://github.com/v1ack/watchfaceEditor/raw/master/assets/icon/android-chrome-192x192.png)](https://v1ack.github.io/watchfaceEditor/ "v1ack.github.io/watchfaceEditor")

![GitHub last commit](https://img.shields.io/github/last-commit/v1ack/watchfaceEditor) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/v1ack/watchfaceEditor.svg) ![](https://img.shields.io/github/stars/v1ack/watchfaceEditor.svg) ![](https://img.shields.io/github/forks/v1ack/watchfaceEditor.svg) ![](https://img.shields.io/github/issues/v1ack/watchfaceEditor.svg)

Watchface editor for **Amazfit Bip**, **Amazfit Cor** and **Mi Band 4**

First you should disassemble **watchface.bin** file and then upload all images and .json file to this app

There is a full instruction in app

## Development
Install Node.js and npm

Install packages `npm install`

Start dev server `npm run dev`

Open local on http://localhost:9000/

## How to help with translation
There are two apps - watchface editor and image creator

To translate watchface editor you need:
* add json with translation to `dev/translation/{lang-name}.json`
* import your lang in ` dev/js/app.js` (see other langs)
* add checking and setting language on app open in `dev/js/watchfaceEditor.js`
* add button for choosing language in `index.html`

To translate watchface editor you need:
* add json with translation to `assets/translation_ic/czech.json`
* add checking and setting language on app open in `js/image_creator.js`
* add button for choosing language in `imagecreator.html`

For testing use development instruction above