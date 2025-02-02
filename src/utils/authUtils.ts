import jwt from 'jsonwebtoken';

// Secret key for JWT, typically stored in environment variables
const secret = process.env.JWT_SECRET || 'yourSecretKey';

export const generateToken = (userId: number, role: string) => {
  return jwt.sign({ userId, role }, secret);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};
