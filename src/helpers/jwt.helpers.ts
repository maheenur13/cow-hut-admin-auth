import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';

type IPayload = {
  id: Types.ObjectId | string;
  role: 'admin' | 'seller' | 'buyer';
};

const createToken = (
  payload: IPayload,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
