
const { Router } = require('express');
const router = Router();

const ProductControllerMONGO = require('../controllers/product.controller.mongo')

////////////////  LOGGER///////////////
const { logger_info, logger_warn, logger_error } = require('../logs/log_config');

// Middlewares
const { validarInputsProduct, isLogged, isAdmin } = require('../middlewares/validaciones')

let admin = true;

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        _id: 
 *          type: string
 *          description: ID del producto
 *        nombre: 
 *          type: string
 *          description: Nombre del producto
 *        descripcion: 
 *          type: string
 *          description: Descripción del producto
 *        codigo: 
 *          type: string
 *          description: Código del producto
 *        foto: 
 *          type: string
 *          description: Foto (url) del producto
 *        precio: 
 *          type: number
 *          description: Precio del producto
 *        stock: 
 *          type: integer
 *          description: Stock del producto
 *      required:
 *        - nombre
 *        - descripcion
 *        - codigo
 *        - precio
 *        - stock
 *      example:
 *        nombre: Consola
 *        descripcion: Sony PS5
 *        codigo: AJJ45645
 *        foto : 'http://www.foto.com/foto.jpg'
 *        precio: 5800.50
 *        stock: 5
 */

/**
 * @swagger
 * /api/productos:
 *  get:
 *    summary: Devuelve todos los productos
 *    tags: [Products]
 *    responses:
 *      200: 
 *        description: todos los productos
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status: 
 *                  type: string
 *                result:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Product'
 */
router.get('/', isLogged, async (req, res) => {
  try {    

    logger_info.info(`Ruta ${req.method} - "${req.hostname}:${req.socket.localPort}${req.baseUrl}" accedida - Email: ${req.session.user.email} - User: ${req.session.user.nombre}`);  

    let result = await ProductControllerMONGO.getAll()
    return res.status(200).send(result);          

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

/**
 * @swagger
 * /api/productos/{id}:
 *  get:
 *    summary: Devuelve un producto por ID
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del producto
 *    responses:
 *      200: 
 *        description: todos los productos
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Product' 
 */
router.get('/:id', isLogged, async (req, res) => {  
  let { id } = req.params;
  try {    
      
    let result = await ProductControllerMONGO.getById(id);
    return res.status(200).send(result);

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }  
});

/**
 * @swagger
 * /api/productos:
 *  post:
 *    summary: Crea un nuevo producto
 *    tags: [Products]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200: 
 *        description: nuevo producto fue creado
 */
router.post('/', isLogged, validarInputsProduct, isAdmin, async (req, res) => {

  try {    
      
    let result = await ProductControllerMONGO.createProduct(req.body);
    return res.status(200).send(result);    

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }

});

/**
 * @swagger
 * /api/productos/{id}:
 *  put:
 *    summary: Actualiza un producto por ID
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del producto 
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200: 
 *        description: Producto actualizado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Product' 
 */
router.put('/:id', isLogged, validarInputsProduct, isAdmin, async (req, res) => {
  let { id } = req.params;            
  try {
       
    let result = await ProductControllerMONGO.editProduct(id, req.body)
    return res.status(200).send(result);         

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

/**n
 * @swagger
 * /api/productos/{id}:
 *  delete:
 *    summary: Elimina un producto por ID
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del producto
 *    responses:
 *      200: 
 *        description: Producto eliminado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Product' 
 */
router.delete('/:id', isLogged, isAdmin, async (req, res) => {
  let { id } = req.params;            

  try {
    
    let result = await ProductControllerMONGO.deleteProduct(id);
    return res.status(200).send(result);            

  } catch (error) {
    res.status(404).send({status:'ERROR', result: error.message}); 
  }
})

module.exports = router;


