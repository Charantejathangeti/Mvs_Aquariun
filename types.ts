export type Role = 'OWNER' | 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  category: 'Live Fish' | 'Supplies';
  price: number; // in INR
  weight: number; // in grams
  stockCount: number;
  image?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingDetails {
  customerName: string;
  address: string;
  city: string;
  state: 'Telangana' | 'Andhra Pradesh'; // Restricted Zones
  pincode: string; // Kept for address completeness, though input removed as per strict UI reduction if needed, but usually address needs pin. Prompt said "Remove Pin Code input" specifically related to calculators. We will make it part of the generic address block.
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingDetails: ShippingDetails;
  totalAmount: number;
  shippingCost: number;
  status: 'PENDING_WHATSAPP' | 'CONFIRMED' | 'SHIPPED';
  createdAt: string;
}
