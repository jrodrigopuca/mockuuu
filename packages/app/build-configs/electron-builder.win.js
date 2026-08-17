const commonConfig = require('./electron-builder.common');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = Object.assign({}, commonConfig, {
  forceCodeSigning: true,
  win: {
    target: [{ target: 'nsis' }, { target: 'portable' }],
    // Azure Trusted Signing — this fork has no account of its own yet
    // (the original values here were the upstream Mockoon team's own
    // account/profile names). Sourced from env vars rather than hardcoded
    // so nothing in the repo points at someone else's signing account;
    // set these once a real Azure Trusted Signing account exists.
    azureSignOptions: {
      publisherName: process.env.AZURE_SIGN_PUBLISHER_NAME,
      endpoint: process.env.AZURE_SIGN_ENDPOINT,
      certificateProfileName: process.env.AZURE_SIGN_CERT_PROFILE,
      codeSigningAccountName: process.env.AZURE_SIGN_ACCOUNT_NAME,
      TimestampRfc3161: 'http://timestamp.acs.microsoft.com',
      TimestampDigest: 'SHA256'
    }
  },
  nsis: {
    artifactName: 'mockoon.setup.${version}.${ext}'
  },
  portable: {
    artifactName: 'mockoon.portable.${version}.${ext}'
  }
});

module.exports = config;
