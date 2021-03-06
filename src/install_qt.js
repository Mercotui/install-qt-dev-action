const core = require('@actions/core');
const github = require('@actions/github');
const util = require('util');
const fs = require('fs');
const child_process = require('child_process');
const axios = require('axios');

const installer_base_url = 'http://download.qt.io/official_releases/online_installers/';
const installer_executables = {
  'win32': 'qt-unified-windows-x86-online.exe',
  'linux': 'qt-unified-linux-x64-online.run',
  'darwin': 'qt-unified-mac-x64-online.dmg'
};

main();
async function main() {
  try {
    const runner_os = process.platform;
    const installer_path = installer_executables[runner_os];
    const settings = await getSettings();
    const response = await downloadInstaller(installer_path);
    await saveInstaller(response.data, installer_path);
    await prepareInstaller(process.platform, installer_path);
    await runInstaller(process.platform, installer_path, settings.packages);
    console.log('Install Complete!');
  } catch (error) {
    core.setFailed(`install qt dev action failed: ${error}`);
  }
}

function getSettings() {
  const settings = getInputs();
  return settings;
}

function getInputs(){
  const package_list = core.getInput('packages', { required: true });
  console.log('Desired packages are: '+package_list)
  return {packages: package_list};
}

function downloadInstaller(installer_path) {
  const installer_url = installer_base_url + installer_path;
  console.log('Downloading Installer ' + installer_url);
  return axios.get(installer_url, {
    responseType: 'stream'
  });
}

function saveInstaller(data, installer_path) {
  console.log('Saving installer to ' + installer_path);
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(installer_path);
    data.pipe(file);
    file.on("finish", resolve);
    file.on("error", reject);
  });
}

function prepareInstaller(os, installer_path) {
  switch (os) {
    case 'linux':
      console.log('Setting installer permissions to 775');
      const chmod = util.promisify(fs.chmod);
      return chmod('./' + installer_path, 0o775);
      break;
    case 'darwin':
      console.log('Mounting ' + installer_path);
      // fs.chmod('./' + installer_path, 0o775);
      break;
    case 'win32':
      break;
    default:
      throw ("Unsuported OS: " + os);
  }
}

function runInstaller(os, installer_path, package_list) {
  return new Promise((resolve, reject) => {
    core.startGroup('Running installer');
    var child;
    switch (os) {
      case 'linux':
        child = child_process.spawn('xvfb-run', ['./' + installer_path, '--verbose', '--script', __dirname+'/qt_installer_script.qs'], {
          stdio: 'inherit',
          env: {QT_PACKAGES: package_list}
        });
        break;
      case 'darwin':
        child = child_process.spawn('./' + installer_path, ['--verbose', '--script', __dirname+'/qt_installer_script.qs'], {
          stdio: 'inherit',
          env: {QT_PACKAGES: package_list}
        });
        break;
      case 'win32':
        child = child_process.spawn('./' + installer_path, ['--verbose', '--script', __dirname+'\\qt_installer_script.qs'], {
          stdio: 'inherit',
          env: {QT_PACKAGES: package_list}
        });
        break;
      default:
        throw ("Unsuported OS: " + os);
    }

    child.on('close', ()=>{
      core.endGroup();
      resolve();
    });
    child.on('error', reject);
  });
}
