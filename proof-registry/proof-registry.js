const crypto = require('crypto');

class ProofRegistry {
  constructor() {
    this.proofs = new Map();
    console.log("ProofRegistry initialized.");
  }

  generateProofHash(workoutData) {
    // Ensure deterministic hash by sorting keys
    const sortedData = Object.keys(workoutData)
      .sort()
      .reduce((acc, key) => {
        acc[key] = workoutData[key];
        return acc;
      }, {});
    
    const dataString = JSON.stringify(sortedData);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  storeProof(workoutId, workoutData, verificationResult, rewards) {
    const proofHash = this.generateProofHash(workoutData);
    const proof = {
      workoutId,
      workoutData,
      verificationResult,
      rewards,
      proofHash,
      timestamp: new Date().toISOString()
    };
    this.proofs.set(workoutId, proof);
    console.log(`Proof stored for workoutId: ${workoutId}, hash: ${proofHash}`);
    return proof;
  }

  getProof(workoutId) {
    return this.proofs.get(workoutId);
  }
}

module.exports = ProofRegistry;
