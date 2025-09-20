import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());

// rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Middleware de errores simple (opcional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
