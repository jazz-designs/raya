// Category Showcase Images (Hosted on Supabase Storage)
const necklaceCategoryImg = 'https://pplgirkehnsrwgtekzge.supabase.co/storage/v1/object/public/products/1789814629398_0yuqt27_necklace2-2.jpeg';
const earringCategoryImg = 'https://pplgirkehnsrwgtekzge.supabase.co/storage/v1/object/public/products/1789814679870_75o3pse_er1-2.jpeg';
const bangleCategoryImg = 'https://pplgirkehnsrwgtekzge.supabase.co/storage/v1/object/public/products/1789814672335_lkudpm7_bn6-2.jpeg';
const braceletCategoryImg = 'https://pplgirkehnsrwgtekzge.supabase.co/storage/v1/object/public/products/1789814651724_kd0640h_br4-2.jpeg';
const watchCategoryImg = 'https://pplgirkehnsrwgtekzge.supabase.co/storage/v1/object/public/products/1789814705072_9j21y0q_wt1-2.jpeg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // After discount price
  lastPrice: number; // Price before discount
  image: string;
  images?: string[];
  category: string;
}

export const BASE_CATEGORIES = ["All", "Necklaces", "Bracelets", "Bangles", "Earrings", "Watches"] as const;
export const CATEGORIES = BASE_CATEGORIES;
export type Category = string;

export interface CollectionItem {
  category: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  startingPrice: number;
  itemCount: number;
}

export const COLLECTIONS: CollectionItem[] = [
  {
    category: "Necklaces",
    title: "Necklaces",
    tagline: "Pendants, Snake Chains & Chokers",
    description: "Layered luxury featuring delicate snake chains, lustrous pearls, and sparkling crystal pendants.",
    image: necklaceCategoryImg,
    startingPrice: 260,
    itemCount: 0,
  },
  {
    category: "Earrings",
    title: "Earrings",
    tagline: "Screw-Back Studs & Floral Florets",
    description: "Hypoallergenic threaded ball-back studs, floral blossoms, and sparkling crystal motifs.",
    image: earringCategoryImg,
    startingPrice: 180,
    itemCount: 0,
  },
  {
    category: "Bangles",
    title: "Bangles",
    tagline: "Stacking & Hinged Bangles",
    description: "High-polish minimal stacks, diamond-cut textures, and mother-of-pearl statement hinged bangles.",
    image: bangleCategoryImg,
    startingPrice: 170,
    itemCount: 0,
  },
  {
    category: "Bracelets",
    title: "Bracelets",
    tagline: "Charms, Wave Links & Gemstones",
    description: "Fluid wrist silhouettes adorned with bezel crystals, four-leaf clovers, and colorful cabochons.",
    image: braceletCategoryImg,
    startingPrice: 250,
    itemCount: 0,
  },
  {
    category: "Watches",
    title: "Watches",
    tagline: "Vintage Luxury Timepieces",
    description: "Jeweled horology featuring royal dials, architectural bezels, and articulated link bracelets.",
    image: watchCategoryImg,
    startingPrice: 650,
    itemCount: 0,
  },
];

/**
 * Computes live category metadata (itemCount, startingPrice) dynamically from retrieved products
 */
export const getCollectionsWithMeta = (currentProducts: Product[] = []): CollectionItem[] => {
  return COLLECTIONS.map(col => {
    const items = currentProducts.filter(p => p.category.toLowerCase() === col.category.toLowerCase());
    const minPrice = items.length > 0 
      ? Math.min(...items.map(p => p.price)) 
      : col.startingPrice;

    return {
      ...col,
      itemCount: items.length,
      startingPrice: minPrice,
    };
  });
};

export const products: Product[] = [];
