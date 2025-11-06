import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token no encontrado' });

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    req.user = decoded; // { sub, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: 'Token Inválido o expirado' });
  }
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!roles.length) return next();
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    return roles.includes(req.user.role)
      ? next()
      : res.status(403).json({ error: 'Forbidden' });
  };
}
