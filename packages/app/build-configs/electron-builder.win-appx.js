const commonConfig = require('./electron-builder.common');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = Object.assign({}, commonConfig, {
  win: {
    target: [{ target: 'appx' }]
  },
  appx: {
    // Own identity for this fork — the original values here were the real
    // Mockoon team's registered Microsoft Store publisher identity
    // (CN=F7BC8E8D-..., "1kB SARL-S"), which this fork has no right to
    // publish under. This CN doesn't need to be pre-registered anywhere for
    // local/sideload builds — electron-builder generates a matching
    // self-signed test certificate automatically since no real Store
    // account/cert is configured.
    publisher: 'CN=jrodrigopuca',
    publisherDisplayName: 'Mockuuu',
    identityName: 'jrodrigopuca.mockuuu',
    applicationId: 'mockuuu',
    backgroundColor: '#ffffff',
    artifactName: 'mockuuu.${version}.${ext}'
  }
});

module.exports = config;
