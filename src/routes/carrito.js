
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

//TODO: permite listar todos los productos guardados en el carrito
router.get('/:id/productos', (req, res) => {});

//TODO: incorporar productos al carrito por su id de carrito
router.post('/:id/productos', (req, res) => {});

//TODO: Eliminar un producto del carrito por su id de carrito y de producto  
router.delete('/:id/productos/:id_prod', (req, res) => {});


export default router;