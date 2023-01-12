
const { Router } = require('express');
const router = Router();

const UserController = require('../controllers/user.controller.mongo')


router.get('/', async (req, res) => {
  try {        

    let result = await UserController.getAll()
    return res.status(200).send(result);          

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.post('/register', async (req, res) => {
  let {email, password, nombre, direccion, edad, telefono, foto} = req.body;

  try {        
    let result = await UserController.register(email, password, nombre, direccion, edad, telefono, foto);
    return res.status(200).send(result);            

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

router.post('/login', async (req, res) => {
  let {email, password} = req.body;
  try {    

    let result = await UserController.login(email, password)    
    
    req.session.user = result.user;

    return res.status(200).send(result);          
  } catch (error) {
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