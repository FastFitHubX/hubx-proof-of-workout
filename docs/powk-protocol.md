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

### Input Validation Rules:

*   `duration`: Must be a number between 5 and 240 (minutes).
*   `heart_rate`: Must be a number between 60 and 220 (bpm).
*   `distance`: Must be a number between 0 and 100 (km).
*   `movement_flag`: Must be a boolean value.

### Anti-Cheat Checks:

To prevent unrealistic activity submissions, the following anti-cheat checks are applied:

*   **Unrealistic Speed:** If `running_speed` (calculated as `distance / (duration / 60)`) exceeds 35 km/h, the activity is rejected.
*   **Suspicious Heart Rate:** A heart rate below 70 bpm for a workout duration of 20 minutes or more is flagged as suspicious (though it may not automatically invalidate the workout if other conditions are met).

## 2.1. Verification Flow

1.  **Input Reception:** The API receives workout data (duration, heart_rate, distance, movement_flag).
2.  **Input Validation:** The data is first validated against predefined ranges and types. If validation fails, an error response is returned.
3.  **Core Verification:** If input is valid, the core PoWk rules are applied (duration, heart rate, movement flag).
4.  **Anti-Cheat Analysis:** Additional checks are performed to identify and reject unrealistic or fraudulent activities.
5.  **Activity Scoring:** For verified activities, an `activityScore` is calculated based on duration and heart rate intensity.
6.  **Reward Calculation:** The `activityScore` is then used to calculate multi-asset cryptocurrency rewards.
7.  **Result Output:** The API returns the verification status, activity score, and calculated rewards.

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

## 5. API Endpoint Example

### `POST /activity/submit`

This endpoint accepts workout data, validates it, calculates an activity score, and determines the corresponding cryptocurrency rewards.

**Request Body:**

```json
{
  "duration": 30,        // in minutes (5-240)
  "heart_rate": 130,     // in bpm (60-220)
  "distance": 5.2,       // in km (0-100)
  "movement_flag": true
}
```

**Response Body:**

```json
{
  "verified": true,
  "activityScore": 48,
  "rewards": {
    "hubx": 24,
    "btc": 0.00001,
    "doge": 5
  }
}
```

## 6. Proof Certificate Model

Upon successful verification and reward calculation, a **Proof Certificate** is generated and stored. This certificate serves as an immutable record of the workout activity and its associated outcomes.

**Proof Certificate Structure:**

```json
{
  "workoutId": "unique-workout-identifier",
  "workoutData": {
    "duration": 30,
    "heart_rate": 120,
    "distance": 5,
    "movement_flag": true
  },
  "verificationResult": {
    "verified": true,
    "activityScore": 36,
    "reason": ""
  },
  "rewards": {
    "hubx": 18,
    "btc": 0.0000036,
    "doge": 3.6
  },
  "proofHash": "sha256-hash-of-workout-data",
  "timestamp": "ISO-8601-timestamp"
}
```

- `workoutId`: A unique identifier for each workout submission.
- `workoutData`: The raw input data provided by the user.
- `verificationResult`: The outcome of the verification process, including `verified` status, `activityScore`, and `reason` for rejection if any.
- `rewards`: The calculated cryptocurrency rewards.
- `proofHash`: A deterministic SHA256 hash of the `workoutData`, ensuring data integrity and immutability.
- `timestamp`: The time when the proof certificate was generated.

## 7. API Endpoint: `GET /proof/:workoutId`

This endpoint allows retrieval of a stored Proof Certificate using its unique `workoutId`.

**Request Parameters:**

- `workoutId`: The unique identifier of the workout.

**Response Body (Success - 200 OK):**

```json
{
  "workoutId": "workout-789",
  "workoutData": {
    "duration": 45,
    "heart_rate": 130,
    "distance": 8,
    "movement_flag": true
  },
  "verificationResult": {
    "verified": true,
    "activityScore": 67.5,
    "reason": ""
  },
  "rewards": {
    "hubx": 33.75,
    "btc": 0.0000067,
    "doge": 6.75
  },
  "proofHash": "d5d2806b613c2db02d312515a0aa3730ee9e4b6a09a8d25e937d9cdabecf6783",
  "timestamp": "2026-03-12T10:00:00.000Z"
}
```

**Response Body (Not Found - 404 Not Found):**

```json
{
  "error": "Proof not found for workoutId: non-existent"
}
```

## 8. Logging and Error Handling

The backend incorporates comprehensive logging to monitor key operations and facilitate debugging. Error handling is implemented for malformed API requests and other operational issues.

**Logged Events:**

- **Workout Verification:** Records the incoming workout data and the outcome of the verification process.
- **Reward Calculation:** Logs the activity score and the calculated rewards.
- **Proof Generation:** Records the `workoutId` and the generated `proofHash` when a proof certificate is stored.
- **API Request Errors:** Captures details of malformed requests, including missing or invalid parameters, and returns appropriate HTTP status codes (e.g., 400 Bad Request).

**Error Handling:**

- **Input Validation:** All incoming API requests are validated against expected data types and ranges. Invalid inputs result in a `400 Bad Request` response with a descriptive error message.
- **Resource Not Found:** Attempts to retrieve non-existent resources (e.g., a proof certificate for an invalid `workoutId`) result in a `404 Not Found` response.
- **Internal Server Errors:** Unforeseen errors are caught, logged, and result in a generic `500 Internal Server Error` to prevent sensitive information leakage.
