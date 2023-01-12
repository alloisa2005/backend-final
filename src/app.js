
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session')

const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc')

const path = require('path'); 

const routerProductos = require('./routes/product.routes')
const routerCarrito = require('./routes/carrito.routes')
const routerLogin = require('./routes/login.routes')

const app = express();

let PORT = process.env.PORT || 8080;

const optionsSwagger = {
  definition:{
    openapi: '3.0.0', 
    info:{
      title: 'CoderHouse- Proyecto Final - Curso Backend',
      version: '1.0.0'
    },
    servers: [{url: 'http://localhost:8080'}]
  },
  apis: [`${path.join(__dirname, './routes/*.js')}`]
}

//////////////////////// Middlewares //////////////////////////////
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({    
  key: 'user_id',
  secret: 'mi palabra secreta',
  resave: false,
  saveUninitialized: false,  
  /* store: store, */
  cookie: { maxAge: 60000 }
}))

//// Conexión MongoDB
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@clusteranthony.rf4uk66.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
mongoose.connect(uri)
  .then( () => console.log(`DB: ${process.env.MONGODB_DB} lista para usar`))
  .catch( err => console.log(err))


app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);
app.use('/api/login', routerLogin);  

// Ruta para documentación SWAGGER
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(optionsSwagger)))

app.use((req,res) => {
  res.send({status: 'ERROR', result: `Ruta ${req.url} no implementada`})
});


app.listen(PORT, () => console.log(`Server Up on Port ${PORT} !!`));