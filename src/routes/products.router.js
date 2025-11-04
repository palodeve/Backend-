
import { Router } from 'express';
//import Product from '../models/product.model.js'; 
import Product from '../models/product.models.js'; 
const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query; 
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

    const result = await Product.paginate(filter, options); // Usar paginate

    // Crear links de paginación
    const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0];
    const buildLink = (p) => {
      const params = new URLSearchParams(req.query);
      params.set('page', p);
      return `${baseUrl}?${params.toString()}`;
    };

    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    };

    res.json(response);

  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ status: 'error', error: 'Error del servidor' });
  }
});


export default router;