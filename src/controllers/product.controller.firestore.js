// Firestore configuration
const db = require('../firestore_config/firestore_db');

class ProductController {

  async getAll() {

    try {      
      const productos = db.collection('productos');
      let result = [];

      let snapshot = await productos.get();
      snapshot.forEach( snap => {
        result.push({id:snap.id, ...snap.data()})
      })

      return {status:'OK', result}; 
      
    } catch (error) {

      return {status:'ERROR', result: error.message};             
    }

  }

  async getById(id) {
    try {
      const docRef = db.collection('productos').doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        return {status:'OK', result:{id:doc.id, ...doc.data()}};
      } else {
        return {status: 'ERROR', result: `No existe producto ID: ${id}`};
      }

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async createProduct(prod) {
    try {      
      let result = await db.collection('productos').add(prod);
      return {status: 'OK', result: `Producto ID: ${result.id} grabado correctamente`};

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async editProduct(id_prod, prod) {

    try {      
      const prodRef = db.collection('productos').doc(id_prod);
      const doc = await prodRef.get();

      if (doc.exists) {
        await prodRef.update(prod);
        return {status:'OK', result:`Producto ID: ${id_prod} actualizado`};
      } else {
        return {status: 'ERROR', result: `No existe producto ID: ${id_prod}`};
      }
    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async deleteProduct(id_prod) {
    try {      
      const prodRef = db.collection('productos').doc(id_prod);
      const doc = await prodRef.get();
      
      if (doc.exists) {
        await prodRef.delete();
        return {status:'OK', result:`Producto ID: ${id_prod} eliminado`};
      } else {
        return {status: 'ERROR', result: `No existe producto ID: ${id_prod}`};
      }      

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  //Creo este metodo por si lo preciso mas adelante
  async getDestacados() {

    try {      
      const destacados = db.collection('productos').where('destacado','==', true);
      let result = [];

      let snapshot = await destacados.get();
      snapshot.forEach( snap => {
        result.push({id:snap.id, ...snap.data()})
      })

      return {status:'OK', result}; 
      
    } catch (error) {
      return {status:'ERROR', result: error.message};             
    }

  }
}

module.exports = new ProductController();