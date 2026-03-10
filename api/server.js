const express = require('express');
const PoWkVerifier = require('../verification-engine/powk-verifier');
const RewardCalculator = require('../reward-engine/reward-calculator');

const app = express();
const verifier = new PoWkVerifier();
const rewardCalculator = new RewardCalculator();

app.use(express.json());

// POST /activity/submit - Accept workout data and return verification + rewards
app.post('/activity/submit', (req, res) => {
  const { duration, heart_rate, distance, movement_flag } = req.body;

  // Validate input
  if (duration === undefined || heart_rate === undefined || movement_flag === undefined) {
    return res.status(400).json({ error: 'Missing required fields: duration, heart_rate, movement_flag' });
  }

  // Verify activity
  const verificationResult = verifier.verify(duration, heart_rate, movement_flag);

  // Calculate rewards if verified
  let rewards = null;
  if (verificationResult.verified) {
    rewards = rewardCalculator.calculateRewards(verificationResult.activityScore);
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
