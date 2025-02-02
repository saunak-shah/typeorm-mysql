import request from 'supertest';
import app from '../src/index'; // Import your Express app
import { UserService } from '../src/services/UserService';
import { generateToken } from '../src/utils/authUtils';

// Mock UserService and Auth Utils
jest.mock('../src/services/UserService');
jest.mock('../src/utils/authUtils');

describe('Users API', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'Admin',
    name: 'Test User',
  };

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczODUyNjExOX0.4D81-FzsjTyjHunZMr_UuUnXhQYzBCHbtTabPoGoFtE';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczODUyNjExOX0.4D81-FzsjTyjHunZMr_UuUnXhQYzBCHbtTabPoGoFtE'; // Replace this with a valid token

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test Case: Create User */
  it('should create a new user', async () => {
    (UserService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (UserService.createUser as jest.Mock).mockResolvedValue(mockUser);
    (generateToken as jest.Mock).mockReturnValue(mockToken);

    const response = await request(app)
      .post('/v1/users')
      .send({ email: 'test@example.com', role: 'Admin', name: 'Test User' })
      .set('Authorization', `Bearer ${token}`);
      console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({ ...mockUser, token: mockToken });
  });

  /**  Test Case: Email Already Exists */
  it('should return an error if email already exists', async () => {
    (UserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/v1/users')
      .send({ email: 'test@example.com', role: 'Admin', name: 'Test User' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toBe('Email already exists.');
  });

  /** Test Case: Get All Users */
  it('should list all users', async () => {
    (UserService.getAllUsers as jest.Mock).mockResolvedValue([mockUser]);

    const response = await request(app).get('/v1/users')
    .set('Authorization', `Bearer ${mockToken}`); // Add the Authorization header


    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([mockUser]);
  });

   /** Test Case: No Users Found */
   it('should return an empty array if no users exist', async () => {
    (UserService.getAllUsers as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get('/v1/users')
    .set('Authorization', `Bearer ${mockToken}`); // Add the Authorization header

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([]);
  });

});
