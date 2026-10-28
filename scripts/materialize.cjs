const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { execFileSync } = require('node:child_process');
const spec = JSON.parse(fs.readFileSync('release-input/release.json', 'utf8'));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
async function download(url) { const result = await fetch(url, { signal: AbortSignal.timeout(180000) }); if (!result.ok) throw new Error(`Download failed: HTTP ${result.status}`); return Buffer.from(await result.arrayBuffer()); }
(async () => {
  if (!/^\d+\.\d+\.\d+$/.test(spec.version) || !/^\d+\.\d+\.\d+$/.test(spec.electronVersion)) throw new Error('Invalid release version');
  const archive = Buffer.concat(spec.parts.map(name => { if (!/^app\.asar\.gz\.\d{3}$/.test(name)) throw new Error('Invalid payload name'); return fs.readFileSync(path.join('release-input', name)); }));
  if (hash(archive) !== spec.archiveSha256) throw new Error('Application payload checksum mismatch');
  const runtime = await download(`https://github.com/electron/electron/releases/download/v${spec.electronVersion}/electron-v${spec.electronVersion}-win32-x64.zip`);
  if (hash(runtime) !== spec.electronSha256) throw new Error('Electron runtime checksum mismatch');
  fs.writeFileSync('electron.zip', runtime);
  execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', "Expand-Archive -LiteralPath 'electron.zip' -DestinationPath 'stage' -Force"], { stdio: 'inherit' });
  fs.writeFileSync('stage/resources/app.asar', zlib.gunzipSync(archive));
  fs.writeFileSync('stage/resources/app-update.yml', JSON.stringify({ ...spec.publish, updaterCacheDirName: 'per-panel-updater' }, null, 2));
  fs.renameSync('stage/electron.exe', 'stage/Javerk Mediaplayer.exe');
  const rcedit = require.resolve('electron-winstaller/vendor/rcedit.exe');
  execFileSync(rcedit, ['stage/Javerk Mediaplayer.exe', '--set-icon', 'release-input/icon.ico', '--set-file-version', spec.version, '--set-product-version', spec.version, '--set-version-string', 'ProductName', 'Javerk Mediaplayer', '--set-version-string', 'FileDescription', 'Javerk Mediaplayer'], { stdio: 'inherit' });
  console.log(`Verified application and Electron runtime for ${spec.version}`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
