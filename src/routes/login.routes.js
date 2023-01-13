
const { Router } = require('express');
const router = Router();

const UserController = require('../controllers/user.controller.mongo')

const { logger_info, logger_error } = require('../logs/log_config');

////////////// Middlewares //////////////
const { isLogged, isAdmin } = require('../middlewares/validaciones')

router.get('/', isLogged, isAdmin, async (req, res) => {
  try {

    logger_info.warn(`Ruta ${req.method} - "${req.hostname}:${req.socket.localPort}${req.baseUrl}" accedida - Email: ${req.session.user.email} - Nombre: ${req.session.user.nombre}`);  

    let result = await UserController.getAll()
    return res.status(200).send(result); 
    
  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

router.post('/register', async (req, res) => {
  let {email, password, nombre, direccion, edad, telefono, foto} = req.body;

  try {        

    logger_info.warn(`Ruta ${req.method} - "${req.hostname}:${req.socket.localPort}${req.baseUrl}" accedida - Email: ${email} - Nombre: ${email}`);  

    let result = await UserController.register(email, password, nombre, direccion, edad, telefono, foto);
    return res.status(200).send(result);            

  } catch (error) {

    logger_error.error(`Ruta ${req.method} - "${req.hostname}:${req.socket.localPort}${req.baseUrl}" accedida - Error: ${error.message}`)

    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
}); 

router.post('/login', async (req, res) => {
  let {email, password} = req.body;
  try {    

    logger_info.info(`Ruta ${req.method} - "${req.hostname}:${req.socket.localPort}${req.baseUrl}" accedida - Email: ${email}`);  

    let result = await UserController.login(email, password)    
    
    req.session.user = result.user;

    return res.status(200).send(result);          
  } catch (error) {

    logger_error.error(`Ruta ${req.method} - "${req.hostname}:${req.socket.localPort}${req.baseUrl}" accedida - Error: ${error.message}`)

    return res.status(400).send({status: 'error', msg: error.message})
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy( (err) => {
    if(err) throw err;
    return res.status(200).send({status: 'ok', msg: 'Usuario deslogueado'})
  })
})

module.exports = router;