# DEPRECATED install-qt-dev-action
Update 12-02-2020:
This tool no longer works, due to Qt changing their distribution approach.
All binaries now require valid Qt Accounts to install.
A possible solution is to add support for passing account details via secrets,
but I currently have no intention of adding this.

 
A GitHub action that installs Qt development modules using the Qt online installer gui.
This is probably not as stable as [Install Qt by jurpel](https://github.com/marketplace/actions/install-qt),
but this solution might provide specific packages otherwise not available, so I hope it helps someone!

## How to use

You only have to pass one parameter `packages`: a comma separated list of packages.
Note the package names are their unique identifiers, you can search for them with [this tool](https://mercotui.com/apps/qt-installer-package-lister/dist/).

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
      uses: actions/install-qt-action@v0.1.1
      with:
        packages: 'qt.qt5.5124.gcc_64, qt.qt5.5124.android_arm64_v8a'
    - name: Test qmake
      run: /Qt/5.12.4/gcc_64/bin/qmake test/test.pro
```

## How it works

This uses a QT installer script, from the [wireshark tools](https://github.com/wireshark/wireshark/blob/master/tools/qt-installer-windows.qs),
the license for which is listed in [LICENSE](LICENSE).
The Qt installer can change at any time which might require changes to the script.

DO NOT USE IF YOU REQUIRE STABILITY

If you accept this chance however, this is the easiest way to install Qt packages that are not included in your package manager.
