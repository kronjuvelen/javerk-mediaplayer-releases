const spec = require('./release-input/release.json');
module.exports = {
  appId: 'no.perpanel.desktop', productName: 'Javerk Mediaplayer', electronVersion: spec.electronVersion,
  directories: { output: 'dist' },
  win: { target: [{ target: 'nsis', arch: ['x64'] }], icon: 'release-input/icon.ico', artifactName: 'Javerk-Mediaplayer-Setup-${version}.${ext}' },
  nsis: { oneClick: false, perMachine: false, allowElevation: false, allowToChangeInstallationDirectory: true, createDesktopShortcut: true, createStartMenuShortcut: true, shortcutName: 'Javerk Mediaplayer', deleteAppDataOnUninstall: false },
  publish: [spec.publish],
};
