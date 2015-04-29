var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');

var constants = require('./constants.js');
var filename = process.argv[2];
var action = process.argv[3];

fs.stat(filename, function(err, stat) {
    if (err) {
        logError(err);
    } else {
        fs.watchFile(filename, onFileChange);
        console.log('listening for', filename, 'changes');
    }
});

function getFileCopyName(filename) {
    var extname = path.extname(filename);

    return path.basename(filename, extname) + Date.now() + extname;
}

function logError() {
    console.error.apply(console, arguments);
}

function onFileChange() {
    var command;

    switch(action) {
        case constants.actions.DELETE:
            command = spawn('rm', [filename]);

            command.on('close', function(code) {
                if (code === 0) {
                    console.log(filename, 'deleted successfully');
                } else {
                    logError(action, 'exited with code', code);
                }
            });

            fs.unwatchFile(filename, onFileChange);

            break;
        case constants.actions.COPY:
            var copyName = getFileCopyName(filename);
            command = spawn('cp', [filename, copyName]);

            command.on('close', function(code) {
                if (code === 0) {
                    console.log(filename, 'copied to', copyName);
                } else {
                    logError(action, 'exited with code', code);
                }
            });

            break;
        default:
            logError('command not found');
            fs.unwatchFile(filename, onFileChange);

            break;
    }
}
