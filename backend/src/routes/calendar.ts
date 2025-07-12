import { Router } from 'express';
const router = Router();
router.get('/', (_req, res) => res.json({ message: 'Calendar route' }));
export default router; 