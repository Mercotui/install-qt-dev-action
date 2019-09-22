const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');
const fs = require('fs');
const child_process = require('child_process');

const installer_url = 'http://download.qt.io/official_releases/online_installers/qt-unified-windows-x86-online.exe';
const installer_executable = 'qt-unified-windows-x86-online.exe';

console.log('Downloading Installer');
download(installer_url, installer_executable, downloaded);

function downloaded() {
  console.log('Downloading Completed\nStarting Installer');
  child_process.execFileSync(installer_executable, ['--help'], { stdio: 'inherit' });
  console.log('Installer Completed');
}

function download (url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const sendReq = request.get(url);

    // verify response code
    sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        sendReq.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb));

    // check for request errors
    sendReq.on('error', (err) => {
        fs.unlink(dest);
        return cb(err.message);
    });

    file.on('error', (err) => { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        return cb(err.message);
    });
  }
