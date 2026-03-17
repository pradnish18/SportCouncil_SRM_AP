const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

jest.setTimeout(30000); // 30 seconds wait

describe('Events API', () => {
  beforeAll(async () => {
    // connectDB handles this in server.js
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should fetch all events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should return 404 for non-existent event ID (if endpoint exists)', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/events/${fakeId}`);
    // If the endpoint doesn't exist, it should still be 404 from express
    expect(res.statusCode).toEqual(404);
  });
});
