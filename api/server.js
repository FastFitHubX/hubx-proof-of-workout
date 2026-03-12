const express = require('express');
const PoWkVerifier = require('../verification-engine/powk-verifier');
const RewardCalculator = require('../reward-engine/reward-calculator');
const ProofRegistry = require('../proof-registry/proof-registry');
const SolanaAnchor = require('../blockchain-anchor/solana-anchor');

const app = express();
const verifier = new PoWkVerifier();
const rewardCalculator = new RewardCalculator();
const proofRegistry = new ProofRegistry();
const solanaAnchor = new SolanaAnchor();

app.use(express.json());

// POST /activity/submit - Accept workout data and return verification + rewards + blockchain anchor
app.post("/activity/submit", async (req, res) => {
  console.log("Workout received:", req.body);
  const { duration, heart_rate, distance, movement_flag, workoutId } = req.body;

  // Input validation
  if (duration === undefined || heart_rate === undefined || distance === undefined || movement_flag === undefined) {
    return res.status(400).json({ verified: false, error: 'Missing required fields: duration, heart_rate, distance, movement_flag' });
  }

  if (typeof duration !== 'number' || duration < 5 || duration > 240) {
    return res.status(400).json({ verified: false, error: 'Invalid duration. Must be a number between 5 and 240 minutes.' });
  }

  if (typeof heart_rate !== 'number' || heart_rate < 60 || heart_rate > 220) {
    return res.status(400).json({ verified: false, error: 'Invalid heart_rate. Must be a number between 60 and 220 bpm.' });
  }

  if (typeof distance !== 'number' || distance < 0 || distance > 100) {
    return res.status(400).json({ verified: false, error: 'Invalid distance. Must be a number between 0 and 100 km.' });
  }

  if (typeof movement_flag !== 'boolean') {
    return res.status(400).json({ verified: false, error: 'Invalid movement_flag. Must be a boolean.' });
  }

  // Verify activity
  const verificationResult = verifier.verify(duration, heart_rate, distance, movement_flag);
  console.log("Verification result:", verificationResult);

  // Calculate rewards if verified
  let rewards = { hubx: 0, btc: 0, doge: 0 };
  if (verificationResult.verified) {
    rewards = rewardCalculator.calculateRewards(verificationResult.activityScore);
    console.log("Rewards calculated:", rewards);
  }

  // Generate proof hash
  const workoutData = { duration, heart_rate, distance, movement_flag };
  const proofHash = proofRegistry.generateProofHash(workoutData);

  // Anchor to Solana if verified
  let solanaTx = null;
  if (verificationResult.verified) {
    try {
      solanaTx = await solanaAnchor.anchorProof(proofHash);
    } catch (error) {
      console.error("Blockchain anchoring failed, but continuing with response:", error.message);
    }
  }

  // Store proof if workoutId is provided
  let proof = null;
  if (workoutId) {
    proof = proofRegistry.storeProof(workoutId, workoutData, verificationResult, rewards, solanaTx);
  }

  // Return result
  res.json({
    verified: verificationResult.verified,
    activityScore: verificationResult.activityScore,
    rewards: rewards,
    proofHash: proofHash,
    solanaTx: solanaTx // Include the transaction reference in the response
  });
});

// GET /proof/:workoutId - Retrieve stored proof
app.get("/proof/:workoutId", (req, res) => {
  const { workoutId } = req.params;
  const proof = proofRegistry.getProof(workoutId);

  if (!proof) {
    return res.status(404).json({ error: `Proof not found for workoutId: ${workoutId}` });
  }

  res.json(proof);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Proof-of-Workout backend service running on port ${PORT}`);
  });
}

module.exports = app;
