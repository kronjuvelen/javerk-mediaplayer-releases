const { createPublicKey, sign, verify } = require('node:crypto');
const { z } = require('zod');
const file = z.object({ url: z.string().regex(/^[A-Za-z0-9._-]+\.exe$/), sha512: z.string().regex(/^[A-Za-z0-9+/]{86}==$/), size: z.number().int().positive().safe() });
const manifest = z.object({ version: z.string().regex(/^\d+\.\d+\.\d+$/), files: z.array(file).length(1), path: z.string(), sha512: z.string(), isAdminRightsRequired: z.boolean().optional(), stagingPercentage: z.number().min(0).max(100).optional() });
function publicKey(value) {
  const key = createPublicKey(value);
  if (key.asymmetricKeyType !== 'ed25519') throw new Error('Oppdateringer krever en Ed25519-utgivelsesnøkkel.');
  return key;
}
function canonical(info, owner, repo) {
  const valid = manifest.parse(info);
  if (info.packages || valid.path !== valid.files[0].url || valid.sha512 !== valid.files[0].sha512) throw new Error('Ugyldig oppdateringsmanifest.');
  return Buffer.from(JSON.stringify({ repository: `${owner}/${repo}`.toLowerCase(), version: valid.version, files: valid.files, path: valid.path, sha512: valid.sha512, isAdminRightsRequired: valid.isAdminRightsRequired || false, stagingPercentage: valid.stagingPercentage ?? 100 }));
}
function verifyManifest(info, key, owner, repo) {
  if (typeof info.javerkSignature !== 'string' || !/^[A-Za-z0-9+/]{86}==$/.test(info.javerkSignature) || !verify(null, canonical(info, owner, repo), publicKey(key), Buffer.from(info.javerkSignature, 'base64'))) throw new Error('Oppdateringen har ingen gyldig Javerk-signatur. Den blir ikke lastet ned.');
  return info;
}
function signManifest(info, key, owner, repo) { return { ...info, javerkSignature: sign(null, canonical(info, owner, repo), key).toString('base64') }; }
module.exports = { publicKey, canonical, verifyManifest, signManifest };
