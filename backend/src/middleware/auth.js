import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'ozono-dev-secret');
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión expirada o inválida' });
  }
}
