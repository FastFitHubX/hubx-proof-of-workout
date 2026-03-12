const assert = require('assert');
const ProofRegistry = require('../proof-registry/proof-registry');

describe('ProofRegistry', () => {
  let registry;

  beforeEach(() => {
    registry = new ProofRegistry();
  });

  it('should generate deterministic hash for same inputs', () => {
    const workoutData = { duration: 30, heart_rate: 120, distance: 5, movement_flag: true };
    const hash1 = registry.generateProofHash(workoutData);
    const hash2 = registry.generateProofHash(workoutData);
    
    assert.strictEqual(hash1, hash2);
  });

  it('should generate same hash regardless of key order', () => {
    const data1 = { a: 1, b: 2 };
    const data2 = { b: 2, a: 1 };
    
    const hash1 = registry.generateProofHash(data1);
    const hash2 = registry.generateProofHash(data2);
    
    assert.strictEqual(hash1, hash2);
  });

  it('should store and retrieve proof correctly', () => {
    const workoutId = 'test-workout';
    const workoutData = { duration: 30, heart_rate: 120, distance: 5, movement_flag: true };
    const verificationResult = { verified: true, activityScore: 36 };
    const rewards = { hubx: 18, btc: 0.0000036, doge: 3.6 };

    registry.storeProof(workoutId, workoutData, verificationResult, rewards);
    const retrieved = registry.getProof(workoutId);

    assert.ok(retrieved);
    assert.strictEqual(retrieved.workoutId, workoutId);
    assert.strictEqual(retrieved.verificationResult.activityScore, 36);
    assert.ok(retrieved.proofHash);
  });
});
