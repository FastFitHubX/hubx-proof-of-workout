# Proof-of-Workout (PoWk) Protocol Documentation

This document outlines the core logic, verification rules, and reward calculation methods for the FastFitHub Proof-of-Workout (PoWk) protocol.

## 1. Proof-of-Workout Logic

The Proof-of-Workout protocol is designed to verify physical activity data from wearable devices and distribute cryptocurrency rewards based on the authenticity and intensity of the workout. The system ensures that only genuine and sufficiently strenuous activities are rewarded.

## 2. Verification Rules

Workout data submitted to the system undergoes a verification process based on the following rules:

*   **Duration:** The workout duration must be at least 20 minutes.
*   **Heart Rate:** The average heart rate during the workout must be at least 110 beats per minute (bpm).
*   **Movement Flag:** A `movement_flag` indicating continuous physical movement must be true.

**Verification Condition:**

A workout is considered **verified** if and only if:

`duration >= 20 minutes AND heart_rate >= 110 bpm AND movement_flag == true`

If these conditions are met, the `workout_verified` status is set to `true`, and an `activityScore` is calculated.

## 3. Activity Scoring Function

For verified workouts, an `activityScore` is calculated to quantify the intensity and duration of the activity. This score is a primary factor in determining the rewards.

**Formula:**

`activityScore = duration × intensity_multiplier`

**Intensity Multiplier based on Heart Rate:**

The `intensity_multiplier` is determined by the heart rate range, reflecting higher intensity for higher heart rates:

| Heart Rate (bpm) | Intensity Multiplier |
| :--------------- | :------------------- |
| 110 - 129        | 1.2                  |
| 130 - 149        | 1.5                  |
| 150+             | 2.0                  |

## 4. Reward Calculation Method

The `activityScore` is converted into cryptocurrency rewards for $HUBX, Bitcoin (BTC), and Dogecoin (DOGE) using predefined reward rates.

**Formulas:**

*   `hubx_reward = activityScore × HUBX_reward_rate`
*   `btc_reward = activityScore × BTC_reward_rate`
*   `doge_reward = activityScore × DOGE_reward_rate`

**Example Reward Rates (for prototype):**

*   `HUBX_reward_rate`: 0.5
*   `BTC_reward_rate`: 0.0000001
*   `DOGE_reward_rate`: 0.1

These rates are configurable and can be adjusted based on protocol economics and market conditions.
