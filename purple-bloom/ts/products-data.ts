// Not wrapped in an IIFE like the other scripts here: this file's only job
// is to expose a shared product catalog as a script-level global so
// cart.ts, product-detail.ts and catalog-filters.ts can all read the same
// data without a module bundler (classic <script> tags share one top-level
// scope, so a top-level const here is visible to the scripts loaded after it).
interface PurpleBloomProduct {
  id: string;
  name: string;
  price: number;
  category: "Blusas" | "Vestidos" | "Pantalones";
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  swatch?: "" | "alt" | "alt2";
}

const PURPLE_BLOOM_PRODUCTS: PurpleBloomProduct[] = [
  {
    id: "blusa-lavanda",
    name: "Blusa Lavanda",
    price: 49.99,
    category: "Blusas",
    description: "Blusa de seda en tono lavanda, corte relajado ideal para el día a día.",
    imageSrc: "img/blusa-lavanda.jpg",
    imageAlt: "Blusa Lavanda: blusa de seda en tono lavanda con lazo en la cintura",
  },
  {
    id: "vestido-violeta",
    name: "Vestido Violeta",
    price: 79.99,
    category: "Vestidos",
    description: "Vestido midi con detalle floral, perfecto para ocasiones especiales.",
    imageSrc: "img/vestido-violeta.jpg",
    imageAlt: "Vestido Violeta: vestido midi violeta con bordado floral y lazo en la cintura",
  },
  {
    id: "pantalon-berenjena",
    name: "Pantalón Berenjena",
    price: 59.99,
    category: "Pantalones",
    description: "Pantalón de corte recto en tono berenjena, versátil y cómodo.",
    imageSrc: "img/pantalon-berenjena.jpg",
    imageAlt: "Pantalón Berenjena: pantalón de corte recto en tono berenjena con pinzas",
  },
  {
    id: "blusa-clasica",
    name: "Blusa Clásica",
    price: 39.99,
    category: "Blusas",
    description: "Blusa atemporal de corte simple, ideal para combinar con cualquier look.",
    imageSrc: "img/blusa-clasica.jpg",
    imageAlt: "Blusa Clásica: blusa blanca de manga corta con botones y cuello camisero",
  },
  {
    id: "vestido-elegante",
    name: "Vestido Elegante",
    price: 84.99,
    category: "Vestidos",
    description: "Vestido de líneas limpias pensado para ocasiones especiales.",
    imageSrc: "img/vestido-elegante.jpg",
    imageAlt: "Vestido Elegante: vestido midi color crudo con escote cruzado y abertura lateral",
  },
  {
    id: "pantalon-slim",
    name: "Pantalón Slim",
    price: 54.99,
    category: "Pantalones",
    description: "Pantalón de corte ajustado que estiliza la silueta.",
    imageSrc: "img/pantalon-slim.jpg",
    imageAlt: "Pantalón Slim: pantalón negro de tiro alto con pinzas y corte ajustado",
  },
  {
    id: "blusa-estampada",
    name: "Blusa Estampada",
    price: 44.99,
    category: "Blusas",
    description: "Blusa con estampado ligero, un toque distinto para el día a día.",
    swatch: "",
  },
  {
    id: "vestido-casual",
    name: "Vestido Casual",
    price: 69.99,
    category: "Vestidos",
    description: "Vestido cómodo de uso diario, fácil de combinar.",
    imageSrc: "img/vestido-casual.jpg",
    imageAlt: "Vestido Casual: vestido lila de tiras con estampado floral y lazo en la cintura",
  },
  {
    id: "pantalon-wide-leg",
    name: "Pantalón Wide Leg",
    price: 59.99,
    category: "Pantalones",
    description: "Pantalón de pierna ancha con caída fluida y mucha comodidad.",
    swatch: "alt2",
  },
];

function findPurpleBloomProduct(id: string): PurpleBloomProduct | undefined {
  return PURPLE_BLOOM_PRODUCTS.find((product) => product.id === id);
}

// A product counts as "on offer" purely by its current price — there is no
// separate discount/original-price field, so this stays correct on its own
// if a price in the list above ever changes.
const OFFER_PRICE_THRESHOLD = 50;

function isOnOffer(product: PurpleBloomProduct): boolean {
  return product.price <= OFFER_PRICE_THRESHOLD;
}
