class RewardCalculator {
  constructor() {
    console.log("RewardCalculator initialized.");
  }
  calculateRewards(activityScore) {
    console.log(`Calculating rewards for activityScore: ${activityScore}`);
    const hubxRewardRate = 0.5; // Example rate
    const btcRewardRate = 0.0000001; // Example rate
    const dogeRewardRate = 0.1; // Example rate

    const hubx = activityScore * hubxRewardRate;
    const btc = activityScore * btcRewardRate;
    const doge = activityScore * dogeRewardRate;

    console.log("Calculated rewards:", { hubx, btc, doge });
    return {
      hubx: parseFloat(hubx.toFixed(5)),
      btc: parseFloat(btc.toFixed(7)),
      doge: parseFloat(doge.toFixed(5))
    };
  }
}

module.exports = RewardCalculator;
