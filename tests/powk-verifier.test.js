const assert = require("assert");
const PoWkVerifier = require("../verification-engine/powk-verifier");

describe("PoWkVerifier", () => {
  let verifier;

  beforeEach(() => {
    verifier = new PoWkVerifier();
  });

  it("should verify a valid workout", () => {
    const result = verifier.verify(30, 120, true);
    assert.strictEqual(result.verified, true);
    assert.strictEqual(result.activityScore, 36);
  });

  it("should reject a workout with low heart rate", () => {
    const result = verifier.verify(30, 100, true);
    assert.strictEqual(result.verified, false);
    assert.strictEqual(result.activityScore, 0);
  });

  it("should reject a workout with short duration", () => {
    const result = verifier.verify(15, 120, true);
    assert.strictEqual(result.verified, false);
    assert.strictEqual(result.activityScore, 0);
  });

  it("should reject a workout with movement_flag as false", () => {
    const result = verifier.verify(30, 120, false);
    assert.strictEqual(result.verified, false);
    assert.strictEqual(result.activityScore, 0);
  });

  it("should calculate activity score correctly for different heart rates", () => {
    let result = verifier.verify(30, 115, true); // 110-129 bpm, multiplier 1.2
    assert.strictEqual(result.verified, true);
    assert.strictEqual(result.activityScore, 36);

    result = verifier.verify(30, 135, true); // 130-149 bpm, multiplier 1.5
    assert.strictEqual(result.verified, true);
    assert.strictEqual(result.activityScore, 45);

    result = verifier.verify(30, 155, true); // 150+ bpm, multiplier 2.0
    assert.strictEqual(result.verified, true);
    assert.strictEqual(result.activityScore, 60);
  });
});
