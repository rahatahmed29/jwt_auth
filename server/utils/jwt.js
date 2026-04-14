import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// @ts-ignore
export const generateAccessToken = (user) => {
  jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    // @ts-ignore
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' },
  );
};

// @ts-ignore
export const generateRefreshToken = (user) => {
  jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    // @ts-ignore
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' },
  );
};
