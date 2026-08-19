import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getEmailStatus, sendTestEmail } from '../email.js';

const router = Router();

router.get('/status', requireAuth, (_req, res) => {
  res.json(getEmailStatus());
});

router.post('/test', requireAuth, async (req, res, next) => {
  try {
    const to = req.body?.to?.trim() || process.env.ADMIN_NOTIFY_EMAIL?.trim();
    if (!to) {
      return res.status(400).json({ error: 'Indica un correo destino (body.to o ADMIN_NOTIFY_EMAIL)' });
    }
    const result = await sendTestEmail(to);
    res.json({ success: true, to, ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
