const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const fs = require('fs');
const child_process = require('child_process');

const installer_base_url = 'http://download.qt.io/official_releases/online_installers/';
const installer_executables = {
  'win32': 'qt-unified-windows-x86-online.exe',
  'linux': 'qt-unified-linux-x64-online.run',
  'darwin': 'qt-unified-mac-x64-online.dmg'
};
const installer_executable = installer_executables[process.platform];
const installer_url = installer_base_url + installer_executable;

main();
async function main() {
  try {
    console.log('Downloading Installer');
    const response = await downloadInstaller(installer_url);
    await saveInstaller(response.data);
    console.log('Download Complete\nRunning Installer');
    await runInstaller();
  } catch (e) {
    console.log(error);
  }
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
  fs.chmodSync('./' + installer_executable, 0o775);

  child_process.execFileSync('./' + installer_executable, ['--verbose', '--script', 'qt_installer_script.qs'], {
    stdio: 'inherit'
  });
  console.log('Installer Completed');
}
