const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.mongo')

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
        email: user.email,
        nombre: user.nombre,
        direccion: user.direccion,
        telefono: user.telefono, 
        foto: user.foto
      }
      return {status: 'ok', msg: '', user: user_msg}

    } catch (error) {
      return {status:'ERROR', result: error.message};             
    }
  }
}

module.exports = new UserController();