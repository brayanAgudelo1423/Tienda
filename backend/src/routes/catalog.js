import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  buildCatalogSnapshot,
  exportCatalogToFile,
  importCatalogFromExportIfEmpty,
} from '../catalogExport.js';

const router = Router();

router.post('/export', requireAuth, async (_req, res, next) => {
  try {
    const { path: filePath, snapshot } = await exportCatalogToFile();
    res.json({
      success: true,
      path: filePath,
      exportedAt: snapshot.exportedAt,
      productCount: snapshot.products.length,
      promotionCount: snapshot.promotions.length,
      snapshot,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/export', requireAuth, async (_req, res, next) => {
  try {
    const snapshot = await buildCatalogSnapshot();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="catalog-export-${Date.now()}.json"`
    );
    res.send(JSON.stringify(snapshot, null, 2));
  } catch (err) {
    next(err);
  }
});

router.post('/import-if-empty', requireAuth, async (_req, res, next) => {
  try {
    const imported = await importCatalogFromExportIfEmpty();
    res.json({ success: true, imported });
  } catch (err) {
    next(err);
  }
});

export default router;
