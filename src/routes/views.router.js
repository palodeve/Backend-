
import { Router } from 'express';
import Product from '../models/product.models.js';
import Cart from '../models/cart.models.js';

const router = Router();

// GET 
router.get('/products', async (req, res) => {
  try {
    const { limit = 5, page = 1, sort, query } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
      lean: true,
    };

    const filter = {};
    if (query) {
      const isAvailable = query.toLowerCase() === 'true' || query.toLowerCase() === 'false';
      if (isAvailable) {
        filter.status = query.toLowerCase() === 'true';
      } else {
        filter.category = query;
      }
    }

    const result = await Product.paginate(filter, options);

    // Renderizar la vista index.handlebars 
    res.render('products', { 
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        // Puedes pasar los query params para construir enlaces en el frontend
        currentQuery: req.query, 
    });

  } catch (err) {
    console.error("Error en vista /products:", err);
    res.render('products', { status: 'error', error: 'Error al cargar productos' });
  }
});

// GET 
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.render('error', { message: 'Producto no encontrado' });
        res.render('productDetail', { product });
    } catch (err) {
        res.render('error', { message: 'Error al obtener el detalle del producto' });
    }
});


// GET 
router.get('/carts/:cid', async (req, res) => {
  try {
   
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.render('error', { message: 'Carrito no encontrado' });

    res.render('cartDetail', { cart });
  } catch (err) {
    res.render('error', { message: 'Error al cargar el carrito' });
  }
});

router.get('/', (req, res) => res.redirect('/products')); 


router.get('/realtimeproducts', async (req, res) => {
    const products = await Product.find().lean();
    res.render('realTimeProducts', { products });
});


export default router;