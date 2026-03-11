class PoWkVerifier {
  constructor() {
    console.log("PoWkVerifier initialized.");
  }
  verify(duration, heart_rate, movement_flag) {
    console.log(`Verifying workout: Duration=${duration}, HeartRate=${heart_rate}, Movement=${movement_flag}`);
    const verified = duration >= 20 && heart_rate >= 110 && movement_flag === true;
    let activityScore = 0;

    if (verified) {
      // Example scoring formula: activityScore = duration * intensity_multiplier
      let intensityMultiplier = 1;
      if (heart_rate >= 110 && heart_rate < 130) {
        intensityMultiplier = 1.2;
      } else if (heart_rate >= 130 && heart_rate < 150) {
        intensityMultiplier = 1.5;
      } else if (heart_rate >= 150) {
        intensityMultiplier = 2.0;
      }
      activityScore = duration * intensityMultiplier;
    }

    console.log("Verification outcome:", { verified, activityScore });
    return {
      verified,
      activityScore: parseFloat(activityScore.toFixed(2))
    };
  }
}

module.exports = PoWkVerifier;
