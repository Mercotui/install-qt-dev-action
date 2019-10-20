# install-qt-action
A GitHub action that installs Qt modules using the Qt online installer gui.

## How to use

You only have to pass one parameter `packages`: a comma separated list of packages.
Note the package name format, for now you need to manually search for them in the download files.
For Qt 5.12.4 they can be found in [updates.xml](https://download.qt.io/online/qtsdkrepository/linux_x64/desktop/qt5_5124/Updates.xml).

Currently the action only supports linux, as it hangs on windows, and I dont know how Apples work.
I plan to add support soonish though.

The following example installs Qt for Desktop gcc 64-bit and Android ARM64-v8a (which takes around 4 minutes):

```yml
name: Example Workflow

on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v1
    - name: install qt
      uses: actions/install-qt-action
      with:
        packages: 'qt.qt5.5124.gcc_64, qt.qt5.5124.android_arm64_v8a'
    - name: Test qmake
      run: /Qt/5.12.4/gcc_64/bin/qmake test/test.pro
```

## How it works

This uses a QT installer script, from the [wireshark tools](https://github.com/wireshark/wireshark/blob/master/tools/qt-installer-windows.qs),
the license for which is listed in [qt_installer_script_license.txt](qt_installer_script_license.txt).
The Qt installer can change at any time which might require changes to the script.

DO NOT USE IF YOU REQUIRE STABILITY

If you accept this chance however, this is the easiest way to install Qt packages that are not included in your package manager.
