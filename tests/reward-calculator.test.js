const assert = require('assert');
const RewardCalculator = require('../reward-engine/reward-calculator');

describe('RewardCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new RewardCalculator();
  });

  it('should calculate rewards correctly for a given activity score', () => {
    const activityScore = 100;
    const rewards = calculator.calculateRewards(activityScore);

    assert.strictEqual(rewards.hubx, 50);
    assert.strictEqual(rewards.btc, 0.00001);
    assert.strictEqual(rewards.doge, 10);
  });

  it('should handle zero activity score', () => {
    const activityScore = 0;
    const rewards = calculator.calculateRewards(activityScore);

    assert.strictEqual(rewards.hubx, 0);
    assert.strictEqual(rewards.btc, 0);
    assert.strictEqual(rewards.doge, 0);
  });
});
