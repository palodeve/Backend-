import { promises as fs } from 'fs';

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.writeFile(this.path, '[]');
        return [];
      }
      throw err;
    }
  }

  async createCart() {
    const carts = await this._readFile();
    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id, products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id === Number(id));
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const cIndex = carts.findIndex(c => c.id === Number(cartId));
    if (cIndex === -1) return null;

    const cart = carts[cIndex];
    const pIndex = cart.products.findIndex(p => p.product === Number(productId));
    if (pIndex !== -1) {
      cart.products[pIndex].quantity += 1;
    } else {
      cart.products.push({ product: Number(productId), quantity: 1 });
    }

    carts[cIndex] = cart;
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}
