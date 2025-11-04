
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId, // Referencia al ID de un producto
          ref: 'Product', // Nombre del modelo referenciado
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;