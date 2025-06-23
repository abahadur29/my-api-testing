const { createItem } = require('../controllers/itemController');
const Item = require('../models/Item');

jest.mock('../models/Item');

describe('Unit: createItem', () => {
  it('should create a new item successfully', async () => {
    const req = { body: { name: 'Pen' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const savedItem = { _id: '1', name: 'Pen' };
    Item.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedItem),
    }));

    await createItem(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedItem);
  });

  it('should return 400 on error', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Item.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Error')),
    }));

    await createItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
  });
});
