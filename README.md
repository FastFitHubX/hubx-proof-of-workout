# hubx-proof-of-workout

![Proof-of-Workout CI](https://github.com/hubx-proof-of-workout/actions/workflows/ci.yml/badge.svg)

Backend service for FastFitHub Proof-of-Workout (PoWk) protocol.

## Overview

The Proof-of-Workout (PoWk) protocol ensures that users' physical activities are verified and rewarded. It uses workout data (duration, heart rate, distance, movement) to calculate an activity score and distribute cryptocurrency rewards ($HUBX, BTC, DOGE).

## Architecture Overview

The backend is structured into several key modules:

- **`verification-engine`**: Contains the core logic for verifying workout data against predefined rules and anti-cheat checks.
- **`reward-engine`**: Calculates cryptocurrency rewards based on the verified activity score.
- **`proof-registry`**: Manages the storage and retrieval of Proof Certificates, ensuring data integrity with deterministic hashing.
- **`api`**: Provides Express API endpoints for workout submission and proof retrieval.
- **`tests`**: Comprehensive unit and integration tests for all modules.
- **`docs`**: Detailed protocol documentation.
- **`diagrams`**: Architecture and flow diagrams.

## Verification Flow

1.  **Submit Workout**: User submits workout data via `POST /activity/submit`.
2.  **Input Validation**: Data is validated for types and ranges.
3.  **Core Verification**: Checks duration, heart rate, and movement.
4.  **Anti-Cheat**: Performs additional checks (e.g., unrealistic speed).
5.  **Scoring & Rewards**: Calculates activity score and rewards if verified.
6.  **Proof Generation**: Generates a deterministic hash and stores a Proof Certificate.
7.  **Response**: Returns verification status, score, rewards, and proof hash.

## How to Run Locally

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/hubx-proof-of-workout.git
    cd hubx-proof-of-workout
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Server

Start the backend service:
```bash
npm start
```
The server will run on `http://localhost:3000`.

### Running Tests

Execute the test suite:
```bash
npm test
```

## API Endpoints

- **`POST /activity/submit`**: Submit workout data.
- **`GET /proof/:workoutId`**: Retrieve a stored Proof Certificate.
- **`GET /health`**: Health check endpoint.

For detailed API documentation, see [docs/powk-protocol.md](docs/powk-protocol.md).
