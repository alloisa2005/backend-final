
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

//TODO: Vacía un carrito y lo elimina
router.delete('/:id', (req, res) => {});

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

//TODO: Eliminar un producto del carrito por su id de carrito y de producto  
router.delete('/:id/productos/:id_prod', (req, res) => {}); 


export default router;