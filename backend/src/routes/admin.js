import express from 'express';
const router = express.Router();

// Placeholder for admin routes
router.get('/', (req, res) => {
  res.json({ message: 'Admin routes' });
});

export default router;
