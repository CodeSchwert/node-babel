import { Router } from 'express';
const router = Router();

router.get('/example', (req, res) => {
  return res.send('Example route!!');
});

export default router;
