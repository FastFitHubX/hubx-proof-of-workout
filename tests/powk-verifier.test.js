const assert = require("assert");
const PoWkVerifier = require("../verification-engine/powk-verifier");

describe("PoWkVerifier", () => {
  let verifier;

  beforeEach(() => {
    verifier = new PoWkVerifier();
  });

  it("should verify a valid workout", () => {
    const result = verifier.verify(30, 120, 5, true);
    assert.strictEqual(result.verified, true);
    assert.strictEqual(result.activityScore, 36);
    assert.strictEqual(result.reason, "");
  });

  it("should reject a workout with low heart rate", () => {
    const result = verifier.verify(30, 100, 5, true);
    assert.strictEqual(result.verified, false);
    assert.strictEqual(result.activityScore, 0);
    assert.strictEqual(result.reason, "Workout did not meet minimum requirements");
  });

  it("should reject a workout with short duration", () => {
    const result = verifier.verify(15, 120, 2, true);
    assert.strictEqual(result.verified, false);
    assert.strictEqual(result.activityScore, 0);
    assert.strictEqual(result.reason, "Workout did not meet minimum requirements");
  });

  it("should reject a workout with movement_flag as false", () => {
    const result = verifier.verify(30, 120, 5, false);
    assert.strictEqual(result.verified, false);
    assert.strictEqual(result.activityScore, 0);
    assert.strictEqual(result.reason, "Workout did not meet minimum requirements");
  });

  it("should reject a workout with unrealistic running speed", () => {
    const result = verifier.verify(30, 120, 20, true); // 20km in 30 mins = 40 km/h
    assert.strictEqual(result.verified, false);
    assert.strictEqual(result.activityScore, 0);
    assert.strictEqual(result.reason, "Unrealistic running speed");
  });

  it("should calculate activity score correctly for different heart rates", () => {
    let result = verifier.verify(30, 115, 5, true); // 110-129 bpm, multiplier 1.2
    assert.strictEqual(result.verified, true);
    assert.strictEqual(result.activityScore, 36);

    result = verifier.verify(30, 135, 5, true); // 130-149 bpm, multiplier 1.5
    assert.strictEqual(result.verified, true);
    assert.strictEqual(result.activityScore, 45);

    result = verifier.verify(30, 155, 5, true); // 150+ bpm, multiplier 2.0
    assert.strictEqual(result.verified, true);
    assert.strictEqual(result.activityScore, 60);
  });
});
