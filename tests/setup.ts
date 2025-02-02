jest.mock('../src/utils/RedisUtility', () => ({
    getJSON: jest.fn().mockResolvedValue(null),
    setJSON: jest.fn().mockResolvedValue(null),
    deleteKey: jest.fn().mockResolvedValue(null),
  }));
  