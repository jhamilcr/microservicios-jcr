import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { signAccessToken, signRefreshToken, verifyRefresh } from '../utils/jwt.js';

function buildTokens(user) {
  const payload = { sub: user._id.toString(), role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

export const register = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });

  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: role || 'user' });

  const { accessToken, refreshToken } = buildTokens(user);
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
};

export const login = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const { accessToken, refreshToken } = buildTokens(user);
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
};

export const me = async (req, res) => {
  return res.json({
    id: req.user.sub,
    email: req.user.email,
    role: req.user.role
  });
};

export const refresh = async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Missing refresh token' });

  let decoded;
  try {
    decoded = verifyRefresh(token);
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  const user = await User.findById(decoded.sub);
  if (!user) return res.status(401).json({ error: 'User not found' });

  const stillValid = user.refreshTokens.find(rt => rt.token === token);
  if (!stillValid) return res.status(401).json({ error: 'Refresh token revoked' });

  // Rotación: eliminar antiguo y emitir nuevo
  user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
  const { accessToken, refreshToken } = buildTokens(user);
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return res.json({ accessToken, refreshToken });
};

export const logout = async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Missing refresh token' });

  const { sub } = req.user || {};
  if (!sub) return res.status(401).json({ error: 'Unauthorized' });

  const user = await User.findById(sub);
  if (!user) return res.status(401).json({ error: 'User not found' });

  user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
  await user.save();

  return res.json({ message: 'Logged out' });
};
