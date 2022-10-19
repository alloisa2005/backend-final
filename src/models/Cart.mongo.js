const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
  product_id: {type: String, required: true},
  quantity: {type: Number, required: true, min: [1, 'Quantity can not be less then 1.'] },
  price: {type: Number, required: true }  
}, {
  timestamps: true, id:false
})

const cartSchema = mongoose.Schema({
  productos: [ItemSchema],
  subTotal: {type: Number, default: 0 }
}, {timestamps: true})

module.exports = mongoose.model('Cart', cartSchema)