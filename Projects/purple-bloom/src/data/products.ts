import { Product, ColorPalette } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Blusa Lavanda Elegante',
    category: 'Blusas',
    price: 34.99,
    description: 'Blusa de seda en tono lavanda suave, ideal para ocasiones formales y oficina.',
    images: ['https://via.placeholder.com/400x500?text=Blusa+Lavanda'],
    colors: ['#E6E6FA', '#FFFFFF', '#D8BFD8'],
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Vestido Violeta Bloom',
    category: 'Vestidos',
    price: 59.99,
    description: 'Vestido corto corte A en color violeta intenso con estampado floral discreto.',
    images: ['https://via.placeholder.com/400x500?text=Vestido+Violeta'],
    colors: ['#8A2BE2', '#4B0082'],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Pantalón Palazo Lila',
    category: 'Pantalones',
    price: 45.00,
    description: 'Pantalón tiro alto de caída ligera y ajuste cómodo en tono lila pastoral.',
    images: ['https://via.placeholder.com/400x500?text=Pantalon+Lila'],
    colors: ['#C8A2C8', '#000000'],
    sizes: ['S', 'M', 'XL'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Chaqueta Blazer Morado Místico',
    category: 'Abrigos',
    price: 79.99,
    description: 'Blazer estructurado formal para dar un toque sofisticado a tu atuendo.',
    images: ['https://via.placeholder.com/400x500?text=Blazer+Morado'],
    colors: ['#4B0082', '#36013F'],
    sizes: ['M', 'L'],
    inStock: false,
  },
];

export const MOCK_COLOR_PALETTES: ColorPalette[] = [
  {
    baseColor: '#E6E6FA', // Lavanda
    matchingColors: ['#FFFFFF', '#D8BFD8', '#4B0082', '#708090'],
    recommendedProductIds: ['1', '3'],
  },
  {
    baseColor: '#8A2BE2', // Violeta
    matchingColors: ['#FFD700', '#F5F5DC', '#000000', '#C8A2C8'],
    recommendedProductIds: ['2', '4'],
  },
];
