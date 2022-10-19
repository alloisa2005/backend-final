
const express = require('express');
const cors = require('cors');

const routerProductos = require('./routes/product.routes')
const routerCarrito = require('./routes/carrito.routes')

const app = express();

let PORT = process.env.PORT || 8080;

app.use(cors());

//app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

app.use((req,res) => {
  res.send({status: 'ERROR', result: `Ruta ${req.url} no implementada`})
});

app.listen(PORT, () => console.log(`Server Up on Port ${PORT} !!`));