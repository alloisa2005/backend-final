
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send({status:'OK', result:'Hola Productos'});
});

export default router;


