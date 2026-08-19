const commonConfig = require('./electron-builder.common');

/**
 * Unsigned Windows build: no code signing certificate available for this fork,
 * so signing is disabled instead of pointing at Mockoon's own Azure signing account.
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = Object.assign({}, commonConfig, {
  forceCodeSigning: false,
  win: {
    target: [{ target: 'nsis' }, { target: 'portable' }]
  },
  nsis: {
    artifactName: 'mockuuu.setup.${version}.${ext}'
  },
  portable: {
    artifactName: 'mockuuu.portable.${version}.${ext}'
  }
});

module.exports = config;
