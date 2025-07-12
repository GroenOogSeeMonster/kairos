import { Router } from 'express';
const router = Router();
// Minimal stub route
router.get('/', (_req, res) => res.json({ message: 'Users route' }));
export default router; 