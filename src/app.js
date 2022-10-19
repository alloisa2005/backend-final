
import express, { json, urlencoded } from 'express';
import cors from 'cors';

import routerProductos from './routes/products.js';
import routerCarrito from './routes/carrito.js';

const app = express();

let PORT = process.env.PORT || 8080;

app.use(cors());

//app.use(express.static(__dirname + '/public'));
app.use(json());
app.use(urlencoded({extended:true}));


app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

app.use((req,res) => {
  res.send({status: 'ERROR', result: `Ruta ${req.url} no implementada`})
});

app.listen(PORT, () => console.log(`Server Up on Port ${PORT} !!`));