const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Item = require('../models/Item');

beforeAll(async () => {
  // Optional: Set test DB or use your current DB
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Integration: /items API', () => {
  let createdId;

  it('POST /items - create item', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Notebook' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Notebook');
    createdId = res.body._id;
  });

  it('GET /items - fetch items', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /items/:id - update item', async () => {
    const res = await request(app)
      .put(`/items/${createdId}`)
      .send({ name: 'Updated Notebook' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Notebook');
  });

  it('DELETE /items/:id - delete item', async () => {
    const res = await request(app).delete(`/items/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Item deleted');
  });
});
