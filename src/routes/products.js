
import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

let productContainer = new Product('productos.txt');

let products = [];

// Middleware para validar si existe el ID del producto
const validarProductId = (req,res,next) => {
  let { id } = req.params;  

  let existe = products.some(p => p.id === parseInt(id)); 

  existe ? next() : res.status(200).send({ status:'ERROR', result: `No existe producto con ID ${id}`});
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
    let respuesta = await productContainer.getAll();  
    if(respuesta.status === 'OK'){
      products = respuesta.result;
    }
    
    res.status(200).send({status:'OK', result: products}); 
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.get('/:id', async (req, res) => {

  try {    
    let respuesta = await productContainer.getById(req.params.id);    

    let prod = respuesta.result
    let status = respuesta.status;
     
    res.status(200).send({status, result: prod}); 
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.post('/', validarInputsProduct, async (req, res) => {

  try {
    let respuesta = await productContainer.addProduct(req.body);    

    res.status(200).send({status: respuesta.status, result: respuesta.result}); 
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }

});

router.put('/:id', validarProductId, validarInputsProduct, (req, res) => {
  try {
    let { id } = req.params;            

    // Obtengo el producto que viene en el body
    let productoBody = req.body;

    // El producto existe porq pasó la validación de ID (validarProductId)
    let prod = products.find( p => p.id === parseInt(id)); 

    prod.nombre      = productoBody.nombre;
    prod.descripcion = productoBody.descripcion;
    prod.codigo      = productoBody.codigo;
    prod.foto        = productoBody.foto;
    prod.precio      = productoBody.precio;
    prod.stock       = productoBody.stock;

    res.status(200).send({status:'OK', result:`Product ${id} modificado`});    
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

router.delete('/:id', validarProductId, (req, res) => {
  try {
    let { id } = req.params;            

    let newProducts = products.filter( p => p.id !== parseInt(id));
    products = newProducts;    

    res.status(200).send({status: 'OK', result: `Producto ID ${id} borrado correctamente`});
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

export default router;


