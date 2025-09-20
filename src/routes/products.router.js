import { Router } from 'express';
import ProductManager from '../productManager.js';

const router = Router();
const pm = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/:pid', async (req, res) => {
  const p = await pm.getProductById(req.params.pid);
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(p);
});

router.post('/', async (req, res) => {
  try {
    const newP = await pm.addProduct(req.body);
    res.status(201).json(newP);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const updated = await pm.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await pm.deleteProduct(req.params.pid);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

export default router;
