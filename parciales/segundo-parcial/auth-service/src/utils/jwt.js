import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
}

export function verifyAccess(token) {
  return jwt.verify(token, config.jwt.accessSecret);
}

export function verifyRefresh(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}
