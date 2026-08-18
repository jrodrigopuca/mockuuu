import { spawn } from 'child_process';
import { createHash } from 'crypto';
import { app, BrowserWindow, shell } from 'electron';
import {
  createReadStream,
  createWriteStream,
  promises as fsPromises
} from 'fs';
import { join as pathJoin } from 'path';
import { gt as semverGt } from 'semver';
import { Config } from 'src/main/config';
import { logError, logInfo } from 'src/main/libs/logs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { ReadableStream } from 'stream/web';

let updateAvailableVersion: string;
const isNotPortable = !process.env['PORTABLE_EXECUTABLE_DIR'];

/**
 * Tell the renderer that an update is available.
 * dom-ready may have been fired already or not.
 * APP_UPDATE_AVAILABLE can be emitted safely twice.
 *
 * @param mainWindow
 */
const notifyUpdate = (mainWindow: BrowserWindow, version: string) => {
  mainWindow.webContents.send('APP_UPDATE_AVAILABLE', version);

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('APP_UPDATE_AVAILABLE', version);
  });
};

/**
 * Verify a downloaded update binary against this release's published
 * SHA256SUMS.txt before it's ever executed. HTTPS only guarantees the
 * transport wasn't tampered with in transit — it says nothing about
 * whether the file at the other end is the one that was actually built
 * and released, so this is the integrity check that closes that gap.
 */
const verifyChecksum = async (
  filePath: string,
  binaryFilename: string,
  version: string
): Promise<boolean> => {
  let checksumsText: string;

  try {
    const response = await fetch(
      `${Config.githubBinaryURL}v${version}/SHA256SUMS.txt`
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    checksumsText = await response.text();
  } catch (error: any) {
    logError(`[MAIN][UPDATE] Error fetching checksums: ${error.message}`);

    return false;
  }

  const checksumLine = checksumsText
    .split('\n')
    .find((line) => line.trim().endsWith(binaryFilename));

  if (!checksumLine) {
    logError(`[MAIN][UPDATE] No checksum entry found for ${binaryFilename}`);

    return false;
  }

  const expectedHash = checksumLine.trim().split(/\s+/)[0].toLowerCase();
  const hash = createHash('sha256');

  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk);
  }

  const actualHash = hash.digest('hex');

  if (expectedHash !== actualHash) {
    logError(
      `[MAIN][UPDATE] Checksum mismatch for ${binaryFilename}: expected ${expectedHash}, got ${actualHash}`
    );

    return false;
  }

  return true;
};

export const checkForUpdate = async (mainWindow: BrowserWindow) => {
  const userDataPath = app.getPath('userData');
  // Shape of the GitHub "latest release" API response (a small subset of
  // it) — this fork checks its own repo's releases, not Mockoon's custom
  // stable.json endpoint, so the field names differ (tag_name, not tag).
  let releaseResponse: { tag_name: string };

  try {
    // try to remove existing old update
    await fsPromises.unlink(
      pathJoin(userDataPath, `mockoon.setup.${Config.appVersion}.exe`)
    );
    logInfo('[MAIN][UPDATE] Removed old update file');
  } catch (_error) {}

  try {
    releaseResponse = await (
      await fetch(Config.latestReleaseDataURL, {
        headers: new Headers({
          pragma: 'no-cache',
          'cache-control': 'no-cache'
        })
      })
    ).json();
  } catch (error: any) {
    logInfo(`[MAIN][UPDATE] Error while checking for update: ${error.message}`);

    return;
  }

  const latestVersion = releaseResponse.tag_name.replace(/^v/, '');

  if (semverGt(latestVersion, Config.appVersion)) {
    logInfo(`[MAIN][UPDATE] Found a new version v${latestVersion}`);

    if (process.platform === 'win32' && isNotPortable) {
      const binaryFilename = `mockoon.setup.${latestVersion}.exe`;
      const updateFilePath = pathJoin(userDataPath, binaryFilename);

      let alreadyDownloaded = false;

      try {
        await fsPromises.access(updateFilePath);
        alreadyDownloaded = true;
      } catch (_error) {}

      if (alreadyDownloaded) {
        logInfo(
          '[MAIN][UPDATE] Binary file already downloaded, verifying checksum'
        );

        if (
          await verifyChecksum(updateFilePath, binaryFilename, latestVersion)
        ) {
          notifyUpdate(mainWindow, latestVersion);
          updateAvailableVersion = latestVersion;

          return;
        }

        logError(
          '[MAIN][UPDATE] Existing download failed checksum verification, re-downloading'
        );
        await fsPromises.unlink(updateFilePath).catch(() => {});
      }

      logInfo('[MAIN][UPDATE] Downloading binary file');

      try {
        const response = await fetch(
          `${Config.githubBinaryURL}v${latestVersion}/${binaryFilename}`
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        await finished(
          Readable.fromWeb(response.body as ReadableStream<any>).pipe(
            createWriteStream(updateFilePath)
          )
        );

        logInfo(
          '[MAIN][UPDATE] Binary file downloaded, verifying checksum'
        );

        if (
          !(await verifyChecksum(updateFilePath, binaryFilename, latestVersion))
        ) {
          logError(
            '[MAIN][UPDATE] Downloaded binary failed checksum verification, aborting update'
          );
          await fsPromises.unlink(updateFilePath).catch(() => {});

          return;
        }

        logInfo('[MAIN][UPDATE] Binary file ready');
        notifyUpdate(mainWindow, latestVersion);
        updateAvailableVersion = latestVersion;
      } catch (error: any) {
        logError(
          `[MAIN][UPDATE] Error while downloading the binary: ${error.message}`
        );
      }
    } else {
      notifyUpdate(mainWindow, latestVersion);
      updateAvailableVersion = latestVersion;
    }
  } else {
    logInfo('[MAIN][UPDATE] Application is up to date');
  }
};

export const applyUpdate = () => {
  const userDataPath = app.getPath('userData');

  if (updateAvailableVersion) {
    if (process.platform === 'win32' && isNotPortable) {
      spawn(
        pathJoin(userDataPath, `mockoon.setup.${updateAvailableVersion}.exe`),
        ['--updated'],
        {
          detached: true,
          stdio: 'ignore'
        }
      ).unref();

      app.quit();
    } else {
      shell.openExternal(
        'https://github.com/jrodrigopuca/mockuuu/releases/latest'
      );
    }
  }
};
