export enum UnitOfMeasure {
  BOTTLES = 'botellas',
  LITERS = 'litros',
  MILLILITERS = 'ml',
  KEGS = 'barriles',
  CASES = 'cajones',
  CANS = 'latas',
  SHOTS = 'onzas/medidas',
  GRAMS = 'gramos',
  KILOGRAMS = 'kg',
  UNITS = 'unidades'
}

export interface Product {
  id: string;
  name: string;
  quantity: number; // Current stock
  maxCapacity: number; // Ideal stock / Full capacity for percentage calc
  unit: UnitOfMeasure;
  minStockAlert: number; // Trigger warning at this amount (absolute units, not %)
}

export interface Supplier {
  id: string;
  name: string;
  phone: string; // Formatting for WhatsApp
  description: string;
  productIds: string[]; // Array of product IDs that this supplier provides
}

export interface CartItem {
  productId: string;
  orderQuantity: number;
}