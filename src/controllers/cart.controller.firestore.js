
const db = require('../firestore_config/firestore_db');

class CartController {

  async getAll() {
    try {      
      const carts = db.collection('carts');
      let result = [];

      let snapshot = await carts.get();
      snapshot.forEach( snap => {
        result.push({id:snap.id, ...snap.data()})
      })

      return {status:'OK', result}; 
      
    } catch (error) {

      return {status:'ERROR', result: error.message};             
    }
  }

  async getById(id_cart) {
    try {
      const docRef = db.collection('carts').doc(id_cart);
      const doc = await docRef.get();

      if (doc.exists) {
        return {status:'OK', result:{id:doc.id, ...doc.data()}};
      } else {
        return {status: 'ERROR', result: `No existe carrito ID: ${id_cart}`};
      }

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async createCart(prod) {

    try {
      let subTotal = prod.quantity * prod.price;
      let result = await db.collection('carts').add({productos: [prod], subTotal, created_at: new Date()});
      return {status: 'OK', result: `Carrito ID: ${result.id} grabado correctamente`};

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async deleteCart(id_cart) {
    try {      
      const prodRef = db.collection('carts').doc(id_cart);
      const doc = await prodRef.get();
      
      if (doc.exists) {
        await prodRef.delete();
        return {status:'OK', result:`Carrito ID: ${id_cart} eliminado`};
      } else {
        return {status: 'ERROR', result: `No existe carrito ID: ${id_cart}`};
      }      

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async addProductToCart(id_cart, producto){
    try {
      const prodRef = db.collection('carts').doc(id_cart);
      const doc = await prodRef.get();

      if (doc.exists) {
        //SubTotal del carrito
        let cart_subT = doc.data().subTotal;
        //Productos del carrito
        let productos = doc.data().productos

        // Veo si el producto que viene por parametro existe en la lista de prods del carro
        let prod_buscado = productos.find( p => p.product_id === producto.product_id);

        // Si el prod ya existe en el carro, aumento su cantidad y actualizo subtotal del carro    
        if(prod_buscado){
          prod_buscado.quantity += producto.quantity                            
        }else {  // Si no existe lo creo
          productos.push(producto)          
        }        
        cart_subT += (producto.quantity * producto.price)      
        await prodRef.update({productos, subTotal: cart_subT});        

        return {status:'OK', result:`Carrito ID: ${id_cart} actualizado`};
      } else {
        return {status: 'ERROR', result: `No existe carrito ID: ${id_cart}`};
      }
    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async deleteProductFromCart(id_cart, id_prod){
    try {      
      const cartRef = db.collection('carts').doc(id_cart);
      const doc = await cartRef.get();
      
      if (doc.exists) {
        // Me quedo con los productos del carrito
        let productos_carrito = doc.data().productos;
        
        // Me quedo con el producto cuyo ID viene por parametro
        let prod_buscado = productos_carrito.find(p => p.product_id === id_prod)

        // Si el producto no existe hago return
        if(!prod_buscado) return {status: 'ERROR', result: `No existe producto ID: ${id_prod} en el carrito`}

        // Quito del array el producto del id que viene por parametro y actualizo subtotal del carrito
        let subTotal = doc.data().subTotal - (prod_buscado.quantity * prod_buscado.price)
        productos_carrito = productos_carrito.filter(p => p.product_id !== id_prod)

        // Si el carrito queda vacío, lo borro directamente
        if(productos_carrito.length === 0) {
          await cartRef.delete();
          return {status: 'OK', result: 'Carrito borrado'};
        }else {
          await cartRef.update({productos:productos_carrito, subTotal});          
          return {status: 'OK', result:`Producto ID: ${id_prod} eliminado`};
        }

        
        return {status:'OK', result:`Producto ID: ${id_prod} eliminado`};
      } else {
        return {status: 'ERROR', result: `No existe carrito ID: ${id_cart}`};
      }      

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }
}

module.exports = new CartController();