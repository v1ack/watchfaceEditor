var path = require('path');

module.exports = {
    entry: './dev/js/watchfaceEditor.js',
    mode: 'none',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};