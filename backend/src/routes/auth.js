import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAdmin } from '../db.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  const admin = verifyAdmin(username, password);
  if (!admin) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET || 'ozono-dev-secret',
    { expiresIn: '7d' }
  );

  res.json({ token, username: admin.username });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const payload = jwt.verify(
      header.slice(7),
      process.env.JWT_SECRET || 'ozono-dev-secret'
    );
    res.json({ username: payload.username });
  } catch {
    res.status(401).json({ error: 'Sesión inválida' });
  }
});

export default router;
