
import { Router } from 'express';
import Cart from '../models/cart.models.js';
import Product from '../models/product.models.js'; 

const router = Router();

// POST 
router.post('/', async (req, res) => {
  try {
    const cart = await Cart.create({}); // carrito vacío
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error creando carrito' });
  }
});

// GET 
router.get('/:cid', async (req, res) => {
  try {
    
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST
router.post('/:cid/product/:pid', async (req, res) => {
  
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const { pid } = req.params;
    const product = await Product.findById(pid); 
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const pIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (pIndex !== -1) {
      cart.products[pIndex].quantity += 1; // Incrementar cantidad
    } else {
      cart.products.push({ product: pid, quantity: 1 }); // Agregar producto
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// DELETE 
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

   
    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    await cart.save();
    res.json({ message: 'Producto eliminado del carrito', cart });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// PUT 
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body; 
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: products }, // Reemplaza todo el array de productos
      { new: true, runValidators: true }
    );
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT 
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const pIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (pIndex !== -1) {
      cart.products[pIndex].quantity = quantity; // Actualiza la cantidad
      await cart.save();
      res.json(cart);
    } else {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
});

// DELETE 
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: [] }, // Deja el array de productos vacío
      { new: true }
    );
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ message: 'Todos los productos eliminados del carrito', cart });
  } catch (err) {
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
});

export default router;