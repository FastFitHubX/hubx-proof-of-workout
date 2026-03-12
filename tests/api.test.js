const request = require('supertest');
const assert = require('assert');
const app = require('../api/server');

describe('API Endpoints', () => {
  it('POST /activity/submit - valid workout', async () => {
    const res = await request(app)
      .post('/activity/submit')
      .send({
        workoutId: 'workout-123',
        duration: 30,
        heart_rate: 120,
        distance: 5,
        movement_flag: true
      });
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.verified, true);
    assert.ok(res.body.proofHash);
  });

  it('POST /activity/submit - invalid workout (low heart rate)', async () => {
    const res = await request(app)
      .post('/activity/submit')
      .send({
        workoutId: 'workout-456',
        duration: 30,
        heart_rate: 100,
        distance: 5,
        movement_flag: true
      });
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.verified, false);
  });

  it('POST /activity/submit - malformed request (missing fields)', async () => {
    const res = await request(app)
      .post('/activity/submit')
      .send({
        duration: 30
      });
    
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
  });

  it('GET /proof/:workoutId - retrieve stored proof', async () => {
    // First submit a workout
    const workoutId = 'workout-789';
    await request(app)
      .post('/activity/submit')
      .send({
        workoutId,
        duration: 45,
        heart_rate: 130,
        distance: 8,
        movement_flag: true
      });

    // Then retrieve it
    const res = await request(app).get(`/proof/${workoutId}`);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.workoutId, workoutId);
    assert.ok(res.body.proofHash);
  });

  it('GET /proof/:workoutId - not found', async () => {
    const res = await request(app).get('/proof/non-existent');
    assert.strictEqual(res.status, 404);
  });
});
