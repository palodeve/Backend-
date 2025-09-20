import { Router } from 'express';

import CartManager from '../CartManager.js';
import ProductManager from '../productManager.js';

const router = Router();
const cm = new CartManager('./src/data/carts.json');
const pm = new ProductManager('./src/data/products.json');

router.post('/', async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error creando carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

// Ruta según la consigna: POST /:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  // primero verifico que el producto existe
  const product = await pm.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  const cart = await cm.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  res.json(cart);
});

export default router;
