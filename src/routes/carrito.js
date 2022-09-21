
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send({status:'OK', result:'Hola Carrito'});
});

export default router;