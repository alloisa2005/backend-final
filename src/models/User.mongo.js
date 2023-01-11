const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {type:String, required: true},
    password: {type:String, required: true},
    nombre: {type:String, required: true},
    direccion: {type:String, required: true},
    edad: {type:Number, required: true},
    telefono: {type:String },
    foto: {type:String, required: true}    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);