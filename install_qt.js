const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const toolcache = require('@actions/tool-cache');

const fs = require('fs');

const installer_base_url = 'http://download.qt.io/official_releases/online_installers/';
const installer_executables = {
  'windows': 'qt-unified-windows-x86-online.exe',
  'linux': 'qt-unified-linux-x64-online.run',
  'macintosh': 'qt-unified-mac-x64-online.dmg'
};

const installer_url = 'http://download.qt.io/official_releases/online_installers/qt-unified-linux-x64-online.run';

console.log('Downloading Installer');
toolcache.downloadTool(installer_url)
.then((installer)=>{
  console.log('Download Complete\nRunning Installer');
  return exec.exec(installer, ['--verbose', '--script', 'qt_installer_script.qs']);
}).then(()=>{
  console.log('Installer Completed Successfully!');
}).catch((error)=>{
  console.log(error);
})
