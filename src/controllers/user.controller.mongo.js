const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.mongo')
const { enviarMail } = require('../utils/enviarMail')

class UserController {

  async getAll() {    
    
    try {

      let result = await UserModel.find()      
      return {status:'OK', result};             

    } catch (error) {

      return {status:'ERROR', result: error.message};             
    }
  }

  async register(email, password, nombre, direccion, edad, telefono, foto) {

    try {

      if(!email) return {status: 'error', msg: 'Email no puede ser nulo'};

      let user = await UserModel.findOne({email});
      if(user) return {status: 'error', msg: 'Email ya registrado'}

      let hashedPassword = await bcrypt.hash(password, 12);
      
      user = await UserModel.create({      
        email,
        password : hashedPassword,
        nombre, 
        direccion, 
        edad, 
        telefono, 
        foto
      })

      //Envío mail al administrador
      let mensaje = `<div><h2>Nuevo Usuario Registrado</h2><p>Email: ${email}</p><p>Nombre: ${nombre}</p><p>Dirección: ${direccion}</p><p>Teléfono: ${telefono}</p><p>Edad: ${edad}</p></div>`;
      enviarMail(process.env.MAIL_NODEMAILER, 'Nuevo Registro', mensaje)

      //Envío mail al usuario que se registró 
      mensaje = `<div><h2>Bienvenido/a</h2><p>Gracias por registrarte en Ecommerce Back, puedes visitar la tienda cuando gustes.</p><a href="#">www.tienda-back.com</a></div>`;
      enviarMail(email, `Ecommerce Back, Bienvenido/a ${nombre}`, mensaje)

      return {status: 'ok', msg: 'Usuario creado con éxito'}

    } catch (error) {
      return {status:'ERROR', result: error.message};             
    }
  }

  async login(email, password) {
    try {
      // Verifico si existe el email registrado
      let user = await UserModel.findOne({email})
      if(!user) return {status: 'error', msg: 'Email no registrado'}

      // Verifico si la contraseña es correcta
      const passCoincide = await bcrypt.compare(password, user.password)
      if(!passCoincide) return {status: 'error', msg: 'Contraseña incorrecta'}

      // Guardo la info del user
      //req.session.user = user;
      let user_msg = {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        direccion: user.direccion,
        telefono: user.telefono, 
        edad: user.edad,
        foto: user.foto,
        isAdmin: user.isAdmin
      }
      return {status: 'ok', msg: '', user: user_msg}

    } catch (error) {
      return {status:'ERROR', result: error.message};             
    }
  }
}

module.exports = new UserController();