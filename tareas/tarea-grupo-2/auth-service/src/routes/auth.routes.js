import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me, refresh, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

r.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().isLength({ min: 2 }),
  body('role').optional().isIn(['user','admin']),
  register
);

r.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  login
);

r.get('/me', requireAuth, me);

r.post('/refresh', refresh);

// logout requiere que el access token esté vigente para invalidar el refresh
r.post('/logout', requireAuth, logout);

export default r;
