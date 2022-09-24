
import { Router } from 'express';
import Cart from '../models/Cart.js'

const router = Router();

let cartContainer = new Cart('carritos.txt');

let carritos = [];

// Middleware para validar si existe el ID del carrito
const validarCarritoId = (req,res,next) => {
  let { id } = req.params;  

  let existe = carritos.some(p => p.id === parseInt(id)); 

  existe ? next() : res.status(200).send({ status:'ERROR', result: `No existe carrito con ID ${id}`});
}

router.post('/', async (req, res) => {
  let carrito = req.body;
  carrito.timestamp = new Date();  

  let respuesta = await cartContainer.addCart(carrito);
  res.send({status: respuesta.status, result: respuesta.result});
});

router.delete('/:id', async (req, res) => {

  let { id } = req.params;
  let respuesta = await cartContainer.deleteById(id);
  res.send(respuesta);
});

router.get('/:id/productos', async (req, res) => {

  let { id } = req.params;
  let respuesta = await cartContainer.getById(id);

  res.send({status: 'OK', result: respuesta.result});
});

router.post('/:id/productos', async (req, res) => {

  let { id } = req.params;
  let productos = req.body;  
  let respuesta = await cartContainer.addProductsToCart(id, productos);

  res.send({status: respuesta.status, result: respuesta.result});
});

router.delete('/:id/productos/:id_prod', async (req, res) => {

  let {id, id_prod} = req.params;
  let respuesta = await cartContainer.deleteProdFromCart(id, id_prod);

  res.send(respuesta);
}); 


export default router;