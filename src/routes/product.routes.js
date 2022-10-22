
const { Router } = require('express');
const router = Router();

const ProductControllerMONGO = require('../controllers/product.controller.mongo')
const ProductControllerFIRESTORE = require('../controllers/product.controller.firestore')

// Middlewares
const { validarInputsProduct } = require('../middlewares/validaciones')

// Con Archivos
//const Product = require('../models/Product')
//let productContainer = new Product('./src/data/productos.txt');

let admin = true;

// Middleware para validar si es Admin el usuario 
const isAdmin = (req,res,next) => {
  admin ? next() : res.status(401).send({ status:'ERROR', result: `Usuario no autorizado para ${req.method}`});
} 

router.get('/', async (req, res) => {
  try {
    // Con Archivos
    //let respuesta = await productContainer.getAll();      
    //return res.status(200).send(respuesta); 

    // Con MongoDB    
    //let result = await ProductControllerMONGO.getAll()
    //return res.status(200).send(result);      

    //Con FIRESTORE
    let result = await ProductControllerFIRESTORE.getAll();    
    return res.status(200).send(result);  

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.get('/:id', async (req, res) => {  
  let { id } = req.params;
  try {    
    // Con Archivos
    //let respuesta = await productContainer.getById(id);    
    //return res.status(200).send(respuesta); 

    // Con MongoDB    
    //let result = await ProductControllerMONGO.getById(id);
    //return res.status(200).send(result);

    //Con FIRESTORE
    let result = await ProductControllerFIRESTORE.getById(id);
    return res.status(200).send(result);

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.post('/', isAdmin, validarInputsProduct, async (req, res) => {

  try {    
    // Con Archivos
    //let prod = req.body;   
    //prod.timestamp = new Date();
    //let respuesta = await productContainer.addProduct(prod);    
    //return res.status(200).send(respuesta); 

    // Con MongoDB    
    //let result = await ProductControllerMONGO.createProduct(req.body);
    //return res.status(200).send(result);

    //Con FIRESTORE
    let result = await ProductControllerFIRESTORE.createProduct(req.body)
    return res.status(200).send(result);

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }

});

router.put('/:id', isAdmin, validarInputsProduct, async (req, res) => {
  let { id } = req.params;            
  try {

    // Con Archivos
    // Obtengo el producto que viene en el body
    //let productoBody = req.body;
    //let respuesta = await productContainer.updateProduct(id, productoBody);    
    //if(respuesta.status === 'ERROR') return res.status(400).send(respuesta);    
    //return res.status(200).send(respuesta);    

    // Con MongoDB    
    //let result = await ProductControllerMONGO.editProduct(id, req.body)
    //return res.status(200).send(result); 
    
    //Con FIRESTORE
    let result = await ProductControllerFIRESTORE.editProduct(id, req.body)
    return res.status(200).send(result);   

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

router.delete('/:id', isAdmin, async (req, res) => {
  let { id } = req.params;            

  try {
    // Con Archivos
    //let respuesta = await productContainer.deleteById(id);    
    //return res.status(200).send(respuesta); 

    // Con MongoDB
    //let result = await ProductControllerMONGO.deleteProduct(id);
    //return res.status(200).send(result);        

    //Con FIRESTORE
    let result = await ProductControllerFIRESTORE.deleteProduct(id);
    return res.status(200).send(result); 

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

module.exports = router;


