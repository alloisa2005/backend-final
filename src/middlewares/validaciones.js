
// Middleware para validar lo que viene en el body como dato de entrada
const validarInputsProduct = (req,res,next) => {
  let producto = req.body;

  if(producto.nombre === '' || producto.precio <= 0 || producto.precio === '' || producto.stock <= 0 || producto.stock === '') {
    return res.status(404).send({
      status: 'ERROR',
      result: 'Ingrese los datos del producto correctamente'
    });
  }
  
  next();
}


module.exports = { validarInputsProduct }