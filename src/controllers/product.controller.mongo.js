const ProductModel = require('../models/Product.mongo');

class ProductController {

  async getAll() {

    try {

      let result = await ProductModel.find()
      return {status:'OK', result};             

    } catch (error) {

      return {status:'ERROR', result: error.message};             
    }
  }

  async getById(id) {
    try {
      let result = await ProductModel.findById(id);
      if(!result) return {status: 'ERROR', result: `No existe producto ID: ${id}`};

      return {status:'OK', result};

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async createProduct(prod) {
    try {

      let result = await ProductModel.create(prod);
      return {status: 'OK', result};

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async editProduct(id_prod, prod) {
    try {
      
      let result = await ProductModel.findByIdAndUpdate(id_prod, prod, {new:true})
      if(!result) return {status: 'ERROR', result: `No existe producto ID: ${id}`}

      return {status: 'OK', result};

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

  async deleteProduct(id_prod) {
    try {

      let result = await ProductModel.findByIdAndDelete(id_prod);
      if(!result) return {status: 'ERROR', result: `No existe producto ID: ${id_prod}`}

      return {status: 'OK', result};

    } catch (error) {
      return {status:'ERROR', result: error.message};
    }
  }

}

module.exports = new ProductController();