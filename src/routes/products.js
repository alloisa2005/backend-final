

import { Router } from 'express';
import Product from '../models/Product.js';


const router = Router();

let productContainer = new Product('./data/productos.txt');

let admin = true;

// Middleware para validar si es Admin el usuario 
const isAdmin = (req,res,next) => {
  admin ? next() : res.status(401).send({ status:'ERROR', result: `Usuario no autorizado para ${req.method}`});
}
 
// Middleware para validar lo que viene en el body como dato de entrada
const validarInputsProduct = (req,res,next) => {
  let producto = req.body;

  if(producto.nombre === '' || producto.precio <= 0 || producto.precio === '' || producto.stock <= 0 || producto.stock === '') return res.status(404).send({
    status: 'ERROR',
    result: 'Ingrese los datos del producto correctamente'
  });

  next();
}

router.get('/', async (req, res) => {
  try {
    //res.set('Access-Control-Allow-Origin', '*');
    let respuesta = await productContainer.getAll();  
    return res.status(200).send(respuesta); 
    
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.get('/:id', async (req, res) => {  
  try {    
    //res.set('Access-Control-Allow-Origin', '*');
    let respuesta = await productContainer.getById(req.params.id);    

    return res.status(200).send(respuesta); 
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.post('/', isAdmin, validarInputsProduct, async (req, res) => {

  try {    
    let prod = req.body;   
    prod.timestamp = new Date();
    let respuesta = await productContainer.addProduct(prod);    

    return res.status(200).send(respuesta); 
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }

});

router.put('/:id', isAdmin, validarInputsProduct, async (req, res) => {
  try {
    let { id } = req.params;            

    // Obtengo el producto que viene en el body
    let productoBody = req.body;

    let respuesta = await productContainer.updateProduct(id, productoBody);    

    if(respuesta.status === 'ERROR') return res.status(400).send(respuesta);
    
    return res.status(200).send(respuesta);    
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    let { id } = req.params;            
    
    let respuesta = await productContainer.deleteById(id);    

    return res.status(200).send(respuesta); 
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

export default router;


