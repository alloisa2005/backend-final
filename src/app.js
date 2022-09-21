
import express, { json, urlencoded } from 'express';
import routerProductos from './routes/products.js';
import routerCarrito from './routes/carrito.js';

const app = express();

let PORT = process.env.PORT || 8080;

//app.use(express.static(__dirname + '/public'));
app.use(json());
app.use(urlencoded({extended:true}));

const server = app.listen(PORT, () => console.log(`Server Up on Port ${PORT} !!`));

app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);