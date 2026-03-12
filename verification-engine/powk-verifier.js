class PoWkVerifier {
  constructor() {
    console.log("PoWkVerifier initialized.");
  }
  verify(duration, heart_rate, distance, movement_flag) {
    console.log(`Verifying workout: Duration=${duration}, HeartRate=${heart_rate}, Distance=${distance}, Movement=${movement_flag}`);
    let verified = duration >= 20 && heart_rate >= 110 && movement_flag === true;
    let reason = "";

    // Anti-cheat checks
    const runningSpeed = distance / (duration / 60); // km/h
    if (runningSpeed > 35) {
      verified = false;
      reason = "Unrealistic running speed";
    }

    if (heart_rate < 70 && duration >= 20) { // Suspiciously low heart rate for a long workout
      // This is a soft check, might not invalidate if other conditions are met, but good for logging
      console.log("Suspiciously low heart rate for a long workout.");
    }

    if (!verified && reason === "") {
      reason = "Workout did not meet minimum requirements";
    }
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

    console.log("Verification outcome:", { verified, activityScore, reason });
    return {
      verified,
      activityScore: parseFloat(activityScore.toFixed(2)),
      reason
    };
  }
}

module.exports = PoWkVerifier;
