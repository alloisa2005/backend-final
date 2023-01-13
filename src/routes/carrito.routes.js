
const { Router } = require('express');
const router = Router();

const CartControllerMONGO = require('../controllers/cart.controller.mongo')

////////////// Middlewares //////////////
const { isLogged, isAdmin, validarInputsProduct } = require('../middlewares/validaciones')
 


/**
 * @swagger
 * components:
 *  schemas:
 *    Cart:
 *      type: object
 *      properties:
 *         id:
 *          type: string
 *         productos: 
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              product_id: 
 *                type: string
 *              quantity: 
 *                type: integer
 *              price: 
 *                type: number
 *              nombre:
 *                type: string
 *              descripcion: 
 *                type: string
 *              codigo: 
 *                type: string
 *              foto: 
 *                type: string
 *              stock: 
 *                type: integer
 *         subTotal:
 *          type: number
 */

/**
 * @swagger
 * /api/carrito:
 *  get:
 *    summary: Devuelve todos los carritos
 *    tags: [Carts]
 *    responses:
 *      200: 
 *        description: todos los carritos
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Cart'
 */
router.get('/', isLogged, isAdmin, async (req, res) => {
  try {
    
    let result = await CartControllerMONGO.getAll()
    return res.status(200).send(result); 

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }  
})

/**
 * @swagger
 * /api/carrito/{id}/productos:
 *  get:
 *    summary: Devuelve los productos de un carrito
 *    tags: [Carts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del carrito
 *    responses:
 *      200: 
 *        description: todos los productos del carrito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Product' 
 *      400:
 *        description: No existe carrito ID
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                result:
 *                  type: string
 */
router.get('/:id/productos', async (req, res) => {

  let { id } = req.params;

  try {
    
    let result = await CartControllerMONGO.getById(id);    
    return res.status(200).send(result); 
    
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }
});

/**
 * @swagger
 * /api/carrito:
 *  post:
 *    summary: Crea un nuevo carrito
 *    tags: [Carts]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              producto: 
 *                type: object
 *                properties:
 *                  product_id: 
 *                    type: string
 *                  quantity: 
 *                    type: integer
 *                  price: 
 *                    type: number
 *                  nombre:
 *                    type: string
 *                  descripcion: 
 *                    type: string
 *                  codigo: 
 *                    type: string
 *                  foto: 
 *                    type: string
 *                  stock: 
 *                    type: integer
 *    responses:
 *      200: 
 *        description: nuevo carrito fue creado
 */
router.post('/',  isLogged, async (req, res) => {
  let { producto } = req.body;  
  try {    
    
    let result = await CartControllerMONGO.createCart(producto);
    return res.status(200).send(result);
    
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }

});

/**
 * @swagger
 * /api/carrito/{id}:
 *  delete:
 *    summary: Elimina un carrito por ID
 *    tags: [Carts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del carrito
 *    responses:
 *      200: 
 *        description: todos los productos del carrito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status: 
 *                  type: string
 *                result:
 *                  type: string
 *      400:
 *        description: No existe carrito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                result:
 *                  rtype: string
 */
router.delete('/:id', isLogged, async (req, res) => {

  let { id } = req.params;  
  try {
    // Con Archivos
    //let respuesta = await cartContainer.deleteById(id);
    //res.send(respuesta);

    // Con MongoDB    
    let result = await CartControllerMONGO.delete(id);
    return res.status(200).send(result);  

    // Con FIRESTORE    
    //let result = await CartControllerFIRESTORE.deleteCart(id)
    //return res.status(200).send(result);  

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }
});

/**
 * @swagger
 * /api/carrito/{id}/productos:
 *  post:
 *    summary: Agrega un producto a un carrito
 *    tags: [Carts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del carrito
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              producto: 
 *                type: object
 *                properties:
 *                  product_id: 
 *                    type: string
 *                  quantity: 
 *                    type: integer
 *                  price: 
 *                    type: number
 *                  nombre:
 *                    type: string
 *                  descripcion: 
 *                    type: string
 *                  codigo: 
 *                    type: string
 *                  foto: 
 *                    type: string
 *                  stock: 
 *                    type: integer
 *    responses:
 *      200: 
 *        description: Producto agregado al carrito
 */
router.post('/:id/productos', isLogged, async (req, res) => {

  let { id } = req.params;
  let { producto } = req.body;
  
  try {
    // Con Archivos    
    //let respuesta = await cartContainer.addProductsToCart(id, productos);
    //return res.status(200).send(respuesta);

    // Con MongoDB
    let result = await CartControllerMONGO.addProductToCart(id, producto)
    return res.status(200).send(result);

    // Con FIRESTORE    
    //let result = await CartControllerFIRESTORE.addProductToCart(id, producto);
    //return res.status(200).send(result);

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }
});

router.delete('/:id_cart/productos/:id_prod', isLogged, async (req, res) => {

  let { id_cart, id_prod } = req.params;

  try {
    // Con Archivos
    //let respuesta = await cartContainer.deleteProdFromCart(id, id_prod);    

    // Con MongoDB
    let result = await CartControllerMONGO.deleteProductFromCart(id_cart, id_prod);
    return res.status(200).send(result);

    // Con FIRESTORE    
    //let result = await CartControllerFIRESTORE.deleteProductFromCart(id_cart, id_prod);
    //return res.status(200).send(result);

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }  
}); 


module.exports = router;