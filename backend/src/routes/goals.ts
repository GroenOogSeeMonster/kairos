import { Router } from 'express';
const router = Router();
router.get('/', (_req, res) => res.json({ message: 'Goals route' }));
export default router; 