
const { Router } = require('express');
const router = Router();

const CartControllerMONGO = require('../controllers/cart.controller.mongo')
const CartControllerFIRESTORE = require('../controllers/cart.controller.firestore')

//let cartContainer = new Cart('./src/data/carritos.txt');

// Middleware para validar lo que viene en el body como dato de entrada
const validarInputsProduct = (req,res,next) => {
  let producto = req.body;
  
  if(producto.id === 0 || producto.nombre === '' || producto.precio <= 0 || producto.precio === '' || producto.stock <= 0 || producto.stock === '') return res.status(404).send({
    status: 'ERROR',
    result: 'Ingrese los datos del producto correctamente'
  });
  
  next();
}

router.get('/', async (req, res) => {
  try {
      // Con MongoDB
    //let result = await CartControllerMONGO.getAll()
    //return res.status(200).send(result); 

    // Con FIRESTORE    
    let result = await CartControllerFIRESTORE.getAll();
    return res.status(200).send(result); 

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }  
})

router.get('/:id/productos', async (req, res) => {

  let { id } = req.params;

  try {
    // Con Archivos
    //let respuesta = await cartContainer.getById(id);
    //res.send({status: 'OK', result: respuesta.result});    

    // Con MongoDB
    //let result = await CartControllerMONGO.getById(id);    
    //return res.status(200).send(result); 

    // Con FIRESTORE    
    let result = await CartControllerFIRESTORE.getById(id);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }
});

router.post('/',  async (req, res) => {
  let { producto } = req.body;  
  try {    
    // Con Archivos 
    //let carrito = req.body;
    //carrito.timestamp = new Date();  
    //let respuesta = await cartContainer.addCart(carrito);
    //res.send(respuesta);

    // Con MongoDB    
    //let result = await CartControllerMONGO.createCart(producto);
    //return res.status(200).send(result);

    // Con FIRESTORE
    let result = await CartControllerFIRESTORE.createCart(producto);
    return res.status(200).send(result);
    
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }

});

router.delete('/:id', async (req, res) => {

  let { id } = req.params;  
  try {
    // Con Archivos
    //let respuesta = await cartContainer.deleteById(id);
    //res.send(respuesta);

    // Con MongoDB    
    //let result = await CartControllerMONGO.delete(id);
    //return res.status(200).send(result);  

    // Con FIRESTORE    
    let result = await CartControllerFIRESTORE.deleteCart(id)
    return res.status(200).send(result);  

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }
});

router.post('/:id/productos', async (req, res) => {

  let { id } = req.params;
  let { producto } = req.body;
  
  try {
    // Con Archivos    
    //let respuesta = await cartContainer.addProductsToCart(id, productos);
    //return res.status(200).send(respuesta);

    // Con MongoDB
    //let result = await CartControllerMONGO.addProductToCart(id, producto)
    //return res.status(200).send(result);

    // Con FIRESTORE    
    let result = await CartControllerFIRESTORE.addProductToCart(id, producto);
    return res.status(200).send(result);

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }
});

router.delete('/:id_cart/productos/:id_prod', async (req, res) => {

  let { id_cart, id_prod } = req.params;

  try {
    // Con Archivos
    //let respuesta = await cartContainer.deleteProdFromCart(id, id_prod);    

    // Con MongoDB
    //let result = await CartControllerMONGO.deleteProductFromCart(id_cart, id_prod);
    //return res.status(200).send(result);

    // Con FIRESTORE    
    let result = await CartControllerFIRESTORE.deleteProductFromCart(id_cart, id_prod);
    return res.status(200).send(result);

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }  
}); 


module.exports = router;