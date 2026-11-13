// Tipos de datos para el dominio de Purple Bloom

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface ColorPalette {
  baseColor: string;
  matchingColors: string[];
  recommendedProductIds: string[];
}

export interface OrderSummary {
  customerName: string;
  shippingAddress: string;
  paymentMethod: string;
  items: CartItem[];
  totalAmount: number;
}
