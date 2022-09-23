
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

router.get('/', (req, res) => {
  res.send({status:'OK', result:'Hola Carrito'});
});

router.get('/:id', validarCarritoId, (req, res) => {

  try {
    let { id } = req.params;    
    let carro = carritos[id-1];    
    res.status(200).send({status:'OK', result: carro}); 
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.post('/', (req, res) => {
  let carrito = req.body;
  carrito.timestamp = new Date();
  console.log(carrito);
});

router.put('/:id', (req, res) => {});

router.delete('/:id', (req, res) => {});

export default router;