const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const fs = require('fs');
const child_process = require('child_process');

const installer_url = 'http://download.qt.io/official_releases/online_installers/qt-unified-windows-x86-online.exe';
const installer_executable = 'qt-unified-windows-x86-online.exe';

main();

function main() {
  console.log('Downloading Installer');
  downloadInstaller().then((response) => {
    saveInstaller(response.data).then(() => {
      console.log('Download Complete\nRunning Installer');
      runInstaller();
      // .then(() => {
      //   console.log('Installer Completed Successfully!');
      // }).catch((error) => {
      //   console.log(error);
      // })
      ;
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });
}

function downloadInstaller() {
  return axios.get(installer_url, {
    responseType: 'stream'
  });
}

function saveInstaller(data) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(installer_executable);
    data.pipe(file);
    file.on("finish", resolve);
    file.on("error", reject);
  });
}

function runInstaller() {
  child_process.execFileSync(installer_executable, ['--help'], {
    stdio: 'inherit'
  });
  console.log('Installer Completed');
}
