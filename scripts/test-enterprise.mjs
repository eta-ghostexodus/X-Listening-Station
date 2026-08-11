import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { computeNetworkAnalysis, extractEntities, sha256 } = require(path.join(root, 'electron', 'enterprise.cjs'));
const caseId = 'test-case';
const state = {
  profiles: [
    { id: 'a', caseId, username: 'alpha' },
    { id: 'b', caseId, username: 'beta' },
  ],
  relationships: [
    { id: '1', caseId, profileId: 'a', relationship: 'follower', username: 'common_follower', displayName: '', bio: '', url: '', avatar: '' },
    { id: '2', caseId, profileId: 'b', relationship: 'follower', username: 'common_follower', displayName: '', bio: '', url: '', avatar: '' },
    { id: '3', caseId, profileId: 'a', relationship: 'following', username: 'common_following', displayName: '', bio: '', url: '', avatar: '' },
    { id: '4', caseId, profileId: 'b', relationship: 'following', username: 'common_following', displayName: '', bio: '', url: '', avatar: '' },
  ],
};
const analysis = computeNetworkAnalysis(state, caseId);
const pair = analysis.pairs[0];
if (!pair || pair.commonFollowerCount !== 1 || pair.commonFollowingCount !== 1 || analysis.commonIdentityCount !== 2) {
  throw new Error('Network overlap regression test failed.');
}
const entities = extractEntities('Contact @alpha #incident https://example.org/a analyst@example.org 0x1234567890123456789012345678901234567890');
for (const type of ['mention', 'hashtag', 'url', 'domain', 'email', 'crypto_eth']) {
  if (!entities.some((item) => item.type === type)) throw new Error(`Entity extraction regression: ${type} missing.`);
}
if (!/^[a-f0-9]{64}$/.test(sha256('enterprise'))) throw new Error('SHA-256 regression test failed.');
console.log('Enterprise network/entity/hash regression tests passed.');
