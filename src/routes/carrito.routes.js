
const { Router } = require('express');
const Cart = require('../models/Cart')
const router = Router();

const CartModel = require('../models/Cart.mongo');
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

router.get('/', async (req, res) => {
  try {
      // Con MongoDB
    let result = await CartModel.find()
    return res.status(200).send({status:'OK', result}); 
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }  
})

router.post('/',  async (req, res) => {
  let { producto } = req.body;
  console.log(producto);
  try {    
    // Con Archivos 
    //let carrito = req.body;
    //carrito.timestamp = new Date();  
    //let respuesta = await cartContainer.addCart(carrito);
    //res.send(respuesta);

    // Con MongoDB
    let subTotal = producto.quantity * producto.price;
    let result = await CartModel.create({productos: producto, subTotal});    
    return res.status(200).send({status: 'OK', result});

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
    let result = await CartModel.findByIdAndDelete(id);
    if(!result) return res.status(404).send({status: 'ERROR', result: `No existe carrito ID: ${id}`});

    return res.status(200).send({status: 'OK', result});  
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }
});

router.get('/:id/productos', async (req, res) => {

  let { id } = req.params;

  try {
    // Con Archivos
    //let respuesta = await cartContainer.getById(id);
    //res.send({status: 'OK', result: respuesta.result});    

    // Con MongoDB
    let result = await CartModel.findById(id);
    if(!result) return res.status(404).send({status: 'ERROR', result: `No existe carrito ID: ${id}`});

    return res.status(200).send({status: 'OK', result}); 
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
    let cart = await CartModel.findById(id)
    if(!cart) return res.status(404).send({status: 'ERROR', result: `No existe carrito ID: ${id}`});

    // Productos que hay en el carro
    let productos = cart.productos;    

    let prod_buscado = productos.find( p => p.product_id === producto.product_id);

    // Si el prod ya existe en el carro, aumento su cantidad y actualizo subtotal del carro    
    if(prod_buscado){
      prod_buscado.quantity += producto.quantity                  
      cart.subTotal += (producto.quantity * producto.price)      
    }else {  // Si no existe lo creo
      cart.productos.push(producto)      
      cart.subTotal += (producto.quantity * producto.price)
    }
    let resp = await CartModel.findByIdAndUpdate({_id: id}, {subTotal:cart.subTotal, productos})

    return res.status(200).send({status:'OK', result:resp});

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }
});

router.delete('/:id_cart/productos/:id_prod', async (req, res) => {

  let {id_cart, id_prod} = req.params;

  try {
    // Con Archivos
    //let respuesta = await cartContainer.deleteProdFromCart(id, id_prod);    

    // Con MongoDB
    let carrito = await CartModel.findById(id_cart);

    // Si el carrito no existe hago return
    if(!carrito) return res.status(404).send({status: 'ERROR', result: `No existe carrito ID: ${id_cart}`});

    let productos_carrito = carrito.productos;  // Array con los productos del carrito

    // Me quedo con el producto cuyo ID viene por parametro
    let prod_buscado = productos_carrito.find(p => p.product_id === id_prod)
    
    // Si el producto no existe hago return
    if(!prod_buscado) return res.status(404).send({status: 'ERROR', result: `No existe producto ID: ${id_prod} en el carrito`});

    // Quito del array el producto del id que viene por parametro y actualizo subtotal del carrito
    let subTotal = carrito.subTotal - (prod_buscado.quantity * prod_buscado.price)
    productos_carrito = productos_carrito.filter(p => p.product_id !== id_prod)
    
    // Si el carrito queda vacío, lo borro directamente
    if(productos_carrito.length === 0) {
      result = await CartModel.findByIdAndDelete(id_cart);
      return res.status(200).send({status: 'OK', result: 'Carrito borrado'}); 
    }else {
      result = await CartModel.findByIdAndUpdate(id_cart, {productos: productos_carrito, subTotal}, {new:true})
      return res.status(200).send({status: 'OK', result}); 
    }
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }

  res.send(respuesta);
}); 


module.exports = router;