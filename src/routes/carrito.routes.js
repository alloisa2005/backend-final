
const { Router } = require('express');
const Cart = require('../models/Cart')

const router = Router();

let cartContainer = new Cart('./src/data/carritos.txt');

// Middleware para validar lo que viene en el body como dato de entrada
const validarInputsProduct = (req,res,next) => {
  let producto = req.body;

  if(producto.id === 0 || producto.nombre === '' || producto.precio <= 0 || producto.precio === '' || producto.stock <= 0 || producto.stock === '') return res.status(404).send({
    status: 'ERROR',
    result: 'Ingrese los datos del producto correctamente'
  });

  next();
}

router.post('/', validarInputsProduct, async (req, res) => {
  let carrito = req.body;
  carrito.timestamp = new Date();  

  let respuesta = await cartContainer.addCart(carrito);
  res.send(respuesta);
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

  res.send(respuesta);
});

router.delete('/:id/productos/:id_prod', async (req, res) => {

  let {id, id_prod} = req.params;
  let respuesta = await cartContainer.deleteProdFromCart(id, id_prod);

  res.send(respuesta);
}); 


module.exports = router;