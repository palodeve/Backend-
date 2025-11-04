import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
//import { engine } from 'express-handlebars';

import path from 'path';
import { fileURLToPath } from 'url';

import multer from 'multer';
import { createServer } from 'http';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
//import ProductManager from './productManager.js';
import useRoutes from './routes/useRoutes.js'
// Configuración para __dirname (porque estamos usando ESModules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 8080;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname +'/views'));

// Routers API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
//app.use(express.static(path.join(__dirname, '/public')));
app.use('/', viewsRouter);
// ProductManager (para usarlo en las vistas)
//const pm = new ProductManager('./src/data/products.json');

// Rutas de vistas
//app.get('/', async(req, res) => {
 // const products = await pm.getProducts();
 // res.render('home', { products });
//});

//app.get('/realtimeproducts', async (req, res) => {
 // const products = await pm.getProducts();
 // res.render('realTimeProducts', { products });
//});


//Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

// WebSocket Server
//const express= require('express');
//const htpp = require('http').createServer;
//const io = require(socket.io)(htpp);
//const io = new Server(server);
//(lo comente xq me tiraba error y use la forma de abajo)


// Crea el servidor HTTP a partir de tu app de Express
const httpServer = createServer(app);

// Conecta Socket.IO al servidor HTTP
const io = new Server(httpServer);

// Conexión de socket
io.on('connection', (socket) => {
  console.log('🟢 Nuevo cliente conectado');

  socket.on('nuevoProducto', async (data) => {
    // Usar Mongoose en lugar de pm.addProduct(data)
    await Product.create(data); 
    const products = await Product.find().lean();
    io.emit('actualizarProductos', products);
  });

  socket.on('eliminarProducto', async (id) => {
    // Usar Mongoose en lugar de pm.deleteProduct(id)
    await Product.deleteOne({ _id: id }); 
    const products = await Product.find().lean();
    io.emit('actualizarProductos', products);
  });
});
// Conectar a MongoDB
mongoose.connect('mongodb+srv://palomadeverill_db_user:v7URqnUHyjgSB4vN@cluster0.wg4ublx.mongodb.net/?appName=Cluster0')
.then(() => {
  console.log('Conectado a MongoDB');
})
.catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

//guardar en postman
//enviroment()

app.get('/api/items',async (req, res) => {
  try {
    const items = await pm.getProducts();
    res.status(200).json({items});
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
})

app.post('/api/items', async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  const newItem = { title, description, code, price, stock, category };

  try {
    const addedItem = await pm.addProduct(newItem);
    res.status(201).json({ message: 'Producto agregado', product: addedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedItem = await pm.updateProduct(id, updateData);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto actualizado', product: updatedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }});
  
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pm.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

app.engine('handlebars', handlebars.engine({
    helpers: {
        // Helper para multiplicar valores (necesario en el carrito)
        multiply: function (a, b) {
            return a * b;
        },
        // Helper para la igualdad (necesario para el select de sort en products.handlebars)
        eq: function (a, b) {
            return a === b;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname +'/views'));