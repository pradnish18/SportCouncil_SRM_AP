const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

jest.setTimeout(30000); // 30 seconds wait

describe('Clubs API', () => {
  beforeAll(async () => {
    // Optionally connect to a test db here, server.js connects to default
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should fetch all clubs', async () => {
    const res = await request(app).get('/api/clubs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should fetch a specific club by ID', async () => {
    // We first fetch all clubs to get a real ID to avoid hardcoding invalid IDs
    const allClubsRes = await request(app).get('/api/clubs');
    if (allClubsRes.body.length > 0) {
       const clubId = allClubsRes.body[0]._id;
       const res = await request(app).get(`/api/clubs/${clubId}`);
       expect(res.statusCode).toEqual(200);
       expect(res.body).toHaveProperty('_id', clubId);
    }
  });

  it('should return 404 for non-existent club ID', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/clubs/${fakeId}`);
    expect(res.statusCode).toEqual(404);
  });
});
