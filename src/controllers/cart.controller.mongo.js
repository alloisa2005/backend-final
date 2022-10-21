const CartModel = require('../models/Cart.mongo')

class CartController {

  async getAll() {
    try {      
      let result = await CartModel.find()
      return {status:'OK', result}; 
    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async getById(id_cart) {
    try {      
      let result = await CartModel.findById(id_cart);
      if(!result) return {status:'ERROR', result: `No existe carrito ID: ${id_cart}`}

      return {status:'OK', result}; 
    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async createCart(prod) {
    try {      
      let subTotal = prod.quantity * prod.price;
      let result = await CartModel.create({productos: prod, subTotal}); 
      return {status:'OK', result};
    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async delete(id_cart) {
    try {      
      let result = await CartModel.findByIdAndDelete(id_cart)
      return {status:'OK', result}; 
    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async addProductToCart(id_cart, producto) {
    try {
      let cart = await CartModel.findById(id_cart)
      if(!cart) return {status: 'ERROR', result: `No existe carrito ID: ${id_cart}`}

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
      let resp = await CartModel.findByIdAndUpdate({_id: id_cart}, {subTotal:cart.subTotal, productos})
      return {status:'OK', result:resp};

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async deleteProductFromCart(id_cart, id_prod){
    try {
      
      let carrito = await CartModel.findById(id_cart);
      // Si el carrito no existe hago return
      if(!carrito) return {status: 'ERROR', result: `No existe carrito ID: ${id_cart}`}

      let productos_carrito = carrito.productos;  // Array con los productos del carrito

      // Me quedo con el producto cuyo ID viene por parametro
      let prod_buscado = productos_carrito.find(p => p.product_id === id_prod)
    
      // Si el producto no existe hago return
      if(!prod_buscado) return {status: 'ERROR', result: `No existe producto ID: ${id_prod} en el carrito`}

      // Quito del array el producto del id que viene por parametro y actualizo subtotal del carrito
      let subTotal = carrito.subTotal - (prod_buscado.quantity * prod_buscado.price)
      productos_carrito = productos_carrito.filter(p => p.product_id !== id_prod)

      // Si el carrito queda vacío, lo borro directamente
      if(productos_carrito.length === 0) {
        let result = await CartModel.findByIdAndDelete(id_cart);
        return {status: 'OK', result: 'Carrito borrado'};
      }else {
        let result = await CartModel.findByIdAndUpdate(id_cart, {productos: productos_carrito, subTotal}, {new:true})
        return {status: 'OK', result};
      }

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }
}

module.exports = new CartController();
