import { Product, User, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

// In-memory "Database"
let productsDB = [...INITIAL_PRODUCTS];
const ordersDB: Order[] = [];

// Mock Auth User
export const MOCK_OWNER: User = { id: 'u1', name: 'Mvs Owner', role: 'OWNER' };
export const MOCK_CUSTOMER: User = { id: 'u2', name: 'Aqua Fan', role: 'CUSTOMER' };

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    // Simulate network delay
    return new Promise((resolve) => setTimeout(() => resolve([...productsDB]), 300));
  },
  
  add: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    productsDB.push(newProduct);
    return newProduct;
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const index = productsDB.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    productsDB[index] = { ...productsDB[index], ...updates };
    return productsDB[index];
  },

  delete: async (id: string): Promise<void> => {
    productsDB = productsDB.filter(p => p.id !== id);
  }
};

export const OrderService = {
  create: async (order: Order): Promise<void> => {
    ordersDB.push(order);
    console.log("Order Logged to DB:", order);
    // In a real app, this would trigger the Invoice Generation PDF logic here
  }
};