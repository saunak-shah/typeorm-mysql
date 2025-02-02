import { Response, NextFunction, Request } from 'express';
import { verifyToken } from '../utils/authUtils';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';
import { InternalException } from '../exceptions/internal-exception';

/**
 * Middleware to authenticate users using JWT tokens.
 * - Extracts the token from the `Authorization` header.
 * - Verifies the token and attaches the decoded user data to `req.user`.
 * - Ensures that the authenticated user ID matches the request ID.
 */
export const authenticate = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization'); // Extract token from header

    if (!authHeader) {
      return next(new UnauthorizedException('Access denied, no token provided.', ErrorCode.UNAUTHORIZED));
    }

    const token = authHeader.replace('Bearer ', ''); // Remove "Bearer " prefix if present
    const decoded = verifyToken(token); // Verify token and extract payload

    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    next(new InternalException('Internal server error.', error, ErrorCode.INTERNAL_EXCEPTION));
  }
};

/**
 * Middleware to authorize users based on roles.
 * - Checks if the authenticated user's role is included in the allowed roles.
 * - If not, denies access.
 */
export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new UnauthorizedException('Access forbidden, insufficient rights.', ErrorCode.UNAUTHORIZED));
    }
    next(); // Proceed to the next middleware
  };
};
