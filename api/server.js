const express = require('express');
const PoWkVerifier = require('../verification-engine/powk-verifier');
const RewardCalculator = require('../reward-engine/reward-calculator');

const app = express();
const verifier = new PoWkVerifier();
const rewardCalculator = new RewardCalculator();

app.use(express.json());

// POST /activity/submit - Accept workout data and return verification + rewards
app.post("/activity/submit", (req, res) => {
  console.log("Workout received:", req.body);
  const { duration, heart_rate, distance, movement_flag } = req.body;

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

  if (typeof distance !== 'number' || distance < 0 || distance > 100) { // Assuming distance in km, max 100km for a single workout
    return res.status(400).json({ verified: false, error: 'Invalid distance. Must be a number between 0 and 100 km.' });
  }

  if (typeof movement_flag !== 'boolean') {
    return res.status(400).json({ verified: false, error: 'Invalid movement_flag. Must be a boolean.' });
  }

  // Verify activity
  const verificationResult = verifier.verify(duration, heart_rate, distance, movement_flag);
  console.log("Verification result:", verificationResult);

  // Calculate rewards if verified
  let rewards = null;
  if (verificationResult.verified) {
    rewards = rewardCalculator.calculateRewards(verificationResult.activityScore);
    console.log("Rewards calculated:", rewards);
  }

  // Return result
  res.json({
    verified: verificationResult.verified,
    activityScore: verificationResult.activityScore,
    rewards: rewards || {
      hubx: 0,
      btc: 0,
      doge: 0
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proof-of-Workout backend service running on port ${PORT}`);
});
