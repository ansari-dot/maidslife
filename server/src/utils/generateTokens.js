import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY || '15m',
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY || '7d',
    }
  );
};
