const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const yaml = require('js-yaml');
const spec = require('../release-input/release.json');
const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' });
const tag = `v${spec.version}`;
const name = `Javerk-Mediaplayer-Setup-${spec.version}.exe`;
let existing;
try { existing = JSON.parse(gh('release', 'view', tag, '--json', 'isDraft')); } catch {}
if (existing && !existing.isDraft) throw new Error('This version is already published. Use a newer version.');
if (!existing) gh('release', 'create', tag, '--target', 'main', '--draft', '--title', `Javerk Mediaplayer ${spec.version}`, '--notes', 'Windows-installasjon med oppdateringer uten innlogging.');
gh('release', 'upload', tag, `dist/${name}`, `dist/${name}.blockmap`, '--clobber');
const manifest = yaml.load(fs.readFileSync('dist/latest.yml', 'utf8'));
if (manifest.version !== spec.version || manifest.files[0].url !== name) throw new Error('Unexpected installer metadata');
const pending = JSON.stringify({ manifest, archiveSha256: spec.archiveSha256, buildCommit: process.env.GITHUB_SHA, runId: process.env.GITHUB_RUN_ID }, null, 2) + '\n';
const api = `repos/${process.env.GH_REPO}/contents/pending/${spec.version}.json`;
let previous;
try { previous = JSON.parse(gh('api', api)).sha; } catch {}
fs.writeFileSync('pending-request.json', JSON.stringify({ message: `Record verified installer metadata for ${tag}`, content: Buffer.from(pending).toString('base64'), ...(previous ? { sha: previous } : {}) }));
gh('api', api, '--method', 'PUT', '--input', 'pending-request.json');
console.log(`DRAFT_READY ${tag}; waiting for release-key signature`);
