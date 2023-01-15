const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const cartSchema = mongoose.Schema({
  productos: [{
    product_id: {type: String, required: true},
    quantity: {type: Number, required: true, min: [1, 'Quantity can not be less then 1.'] },
    price: {type: Number, required: true },
    nombre: {type:String, required: true},
    descripcion: {type:String, required: true},
    codigo: {type:String },
    foto: {type:String, required: true},    
    stock: {type:Number, required: true},
  }],
  subTotal: {type: Number, default: 0 }
}, {timestamps: true})

module.exports = mongoose.model('Cart', cartSchema)