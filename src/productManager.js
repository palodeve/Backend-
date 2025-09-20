import { promises as fs } from 'fs';

export default class ProductManager {
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id === Number(id));
  }

  async addProduct(product) {
    // Validación de campos requeridos
    const required = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const field of required) {
      if (product[field] === undefined || product[field] === '') {
        throw new Error(`Falta campo obligatorio: ${field}`);
      }
    }
    if (typeof product.price !== 'number' && isNaN(Number(product.price))) {
      throw new Error('price debe ser un número');
    }
    if (typeof product.stock !== 'number' && isNaN(Number(product.stock))) {
      throw new Error('stock debe ser un número');
    }
    if (product.status !== undefined && typeof product.status !== 'boolean') {
      throw new Error('status debe ser booleano');
    }
    if (product.thumbnails !== undefined && !Array.isArray(product.thumbnails)) {
      throw new Error('thumbnails debe ser un array de strings');
    }

    const products = await this._readFile();

    // Generar id (incremental)
    const newId = products.length ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      title: product.title,
      description: product.description,
      code: product.code,
      price: Number(product.price),
      status: product.status === undefined ? true : product.status,
      stock: Number(product.stock),
      category: product.category,
      thumbnails: Array.isArray(product.thumbnails) ? product.thumbnails : []
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedData) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) return null;

    // No permitir actualizar el id
    const existing = products[index];
    const merged = { ...existing, ...updatedData, id: existing.id };

    // Validaciones opcionales (ej: price/stock siguen siendo números)
    if (merged.price !== undefined) merged.price = Number(merged.price);
    if (merged.stock !== undefined) merged.stock = Number(merged.stock);
    if (merged.status !== undefined && typeof merged.status !== 'boolean') {
      throw new Error('status debe ser booleano');
    }
    if (merged.thumbnails && !Array.isArray(merged.thumbnails)) {
      throw new Error('thumbnails debe ser un array');
    }

    products[index] = merged;
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const filtered = products.filter(p => p.id !== Number(id));
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return filtered;
  }
}
