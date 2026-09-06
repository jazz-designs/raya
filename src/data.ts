// Necklaces (10 items)
import necklace1 from '../assets/products/necklace/necklace1.jpeg';
import necklace1_2 from '../assets/products/necklace/necklace1-2.jpeg';

import necklace2 from '../assets/products/necklace/necklace2.jpeg';
import necklace2_2 from '../assets/products/necklace/necklace2-2.jpeg';

import necklace3 from '../assets/products/necklace/necklace3.jpeg';
import necklace3_2 from '../assets/products/necklace/necklace3-2.jpeg';

import necklace4 from '../assets/products/necklace/necklace4.jpeg';
import necklace4_2 from '../assets/products/necklace/necklace4-2.jpeg';

import necklace5 from '../assets/products/necklace/necklace5.jpeg';
import necklace5_2 from '../assets/products/necklace/necklace5-2.jpeg';

import necklace6 from '../assets/products/necklace/necklace6.jpeg';
import necklace6_2 from '../assets/products/necklace/necklace6-2.jpeg';

import necklace7 from '../assets/products/necklace/necklace7.jpeg';
import necklace7_2 from '../assets/products/necklace/necklace7-2.jpeg';

import necklace8 from '../assets/products/necklace/necklace8.jpeg';
import necklace8_2 from '../assets/products/necklace/necklace8-2.jpeg';

import necklace9 from '../assets/products/necklace/necklace9.jpeg';
import necklace9_2 from '../assets/products/necklace/necklace9-2.jpeg';

import necklace10 from '../assets/products/necklace/necklace10.jpeg';
import necklace10_2 from '../assets/products/necklace/necklace10-2.jpeg';

// Bracelets (9 items)
import br1 from '../assets/products/bracelets/br1.jpeg';
import br1_2 from '../assets/products/bracelets/br1-2.jpeg';

import br2 from '../assets/products/bracelets/br2.jpeg';
import br2_2 from '../assets/products/bracelets/br2-2.jpeg';

import br3 from '../assets/products/bracelets/br3.jpeg';
import br3_2 from '../assets/products/bracelets/br3-2.jpeg';

import br4 from '../assets/products/bracelets/br4.jpeg';
import br4_2 from '../assets/products/bracelets/br4-2.jpeg';

import br5 from '../assets/products/bracelets/br5.jpeg';
import br5_2 from '../assets/products/bracelets/br5-2.jpeg';

import br6 from '../assets/products/bracelets/br6.jpeg';
import br6_2 from '../assets/products/bracelets/br6-2.jpeg';

import br7 from '../assets/products/bracelets/br7.jpeg';
import br7_2 from '../assets/products/bracelets/br7-2.jpeg';

import br8 from '../assets/products/bracelets/br8.jpeg';

import br9 from '../assets/products/bracelets/br-9.jpeg';
import br9_2 from '../assets/products/bracelets/br9-2.jpeg';

export interface Product {
  id: string;
  name: string;
  material: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images?: string[];
  category: string;
}

export const CATEGORIES = ["All", "Necklaces", "Bracelets"] as const;
export type Category = typeof CATEGORIES[number];

export const products: Product[] = [
  // --- NECKLACES (10 ITEMS) ---
  {
    id: "twin-heart-tulip",
    name: "Twin Heart Tulip Pendant",
    material: "18k Gold Finish • Cubic Zirconia • Anti-Tarnish",
    description: "A romantic floral centerpiece featuring twin heart-cut crystal tulip blooms suspended from a sleek gold snake chain. Handcrafted with waterproof anti-tarnish protection.",
    price: 280,
    originalPrice: 560,
    image: necklace1,
    images: [necklace1, necklace1_2],
    category: "Necklaces"
  },
  {
    id: "pearl-marble-butterfly",
    name: "Pearl Marble Butterfly Necklace",
    material: "18k Gold Finish • Pearl Marble Enamel • Waterproof",
    description: "An exquisite butterfly pendant with white pearl marble enamel and micro-pavé pearl accents along the wings, hung on a silky gold snake chain.",
    price: 299,
    originalPrice: 598,
    image: necklace2,
    images: [necklace2, necklace2_2],
    category: "Necklaces"
  },
  {
    id: "noir-enamel-heart",
    name: "Noir Enamel Heart Snake Chain",
    material: "18k Gold Plated • Black Enamel • Anti-Tarnish",
    description: "A bold yet delicate puffy gold heart pendant with jet-black enamel inlay on a fluid snake chain. Designed to add modern contrast to any layered look.",
    price: 270,
    originalPrice: 540,
    image: necklace3,
    images: [necklace3, necklace3_2],
    category: "Necklaces"
  },
  {
    id: "celestial-sky-butterfly",
    name: "Celestial Sky Butterfly Pendant",
    material: "18k Gold Finish • Sky Blue Enamel • Waterproof",
    description: "An ethereal butterfly charm filled with shimmering sky-blue enamel detailing. Suspended on a silky anti-tarnish gold chain for playful elegance.",
    price: 280,
    originalPrice: 560,
    image: necklace4,
    images: [necklace4, necklace4_2],
    category: "Necklaces"
  },
  {
    id: "blush-pearl-butterfly",
    name: "Blush Pearl Butterfly Necklace",
    material: "18k Solid Gold Finish • Pink Mother-of-Pearl",
    description: "A whimsical golden butterfly featuring soft pink iridescent mother-of-pearl wings. Lightweight and waterproof for effortless daily sparkle.",
    price: 280,
    originalPrice: 560,
    image: necklace5,
    images: [necklace5, necklace5_2],
    category: "Necklaces"
  },
  {
    id: "magnetic-twin-wing-heart",
    name: "Magnetic Twin Wing Heart Choker",
    material: "Hand-textured 18k Gold • Double Strand Chain",
    description: "An ingenious double-strand gold necklace featuring a textured split-heart pendant that closes magnetically. Sophisticated craftsmanship with anti-tarnish sealing.",
    price: 320,
    originalPrice: 640,
    image: necklace6,
    images: [necklace6, necklace6_2],
    category: "Necklaces"
  },
  {
    id: "amethyst-geometric-cube",
    name: "Amethyst Geometric Cube Necklace",
    material: "18k Gold Plated • Amethyst Stone • Anti-Tarnish",
    description: "A contemporary geometric design featuring a soft-cornered triangular amethyst purple stone framed by brushed gold cube beads along a snake chain.",
    price: 299,
    originalPrice: 598,
    image: necklace7,
    images: [necklace7, necklace7_2],
    category: "Necklaces"
  },
  {
    id: "emerald-cabochon-station",
    name: "Emerald Cabochon Station Chain",
    material: "18k Gold Finish • Deep Emerald Cabochon • Waterproof",
    description: "A smooth oval deep emerald cabochon gemstone paired with a gold beaded station chain. Rich vintage allure crafted with waterproof durability.",
    price: 280,
    originalPrice: 560,
    image: necklace8,
    images: [necklace8, necklace8_2],
    category: "Necklaces"
  },
  {
    id: "onyx-bezel-satellite",
    name: "Onyx Bezel Satellite Necklace",
    material: "18k Gold Plated • Emerald-Cut Onyx • Anti-Tarnish",
    description: "An architectural emerald-cut black onyx crystal encased in an octagonal gold bezel, set on a gold satellite beaded chain.",
    price: 280,
    originalPrice: 560,
    image: necklace9,
    images: [necklace9, necklace9_2],
    category: "Necklaces"
  },
  {
    id: "royal-emerald-solitaire",
    name: "Royal Emerald Solitaire Pendant",
    material: "18k Solid Gold Finish • Royal Emerald Solitaire",
    description: "A timeless solitaire tear-drop emerald crystal held in a refined gold basket setting on a whisper-thin chain. Pure luxury for evening wear.",
    price: 260,
    originalPrice: 520,
    image: necklace10,
    images: [necklace10, necklace10_2],
    category: "Necklaces"
  },

  // --- BRACELETS (9 ITEMS) ---
  {
    id: "blossom-crystal-charm-bracelet",
    name: "Blossom Crystal Charm Bracelet",
    material: "18k Gold Finish • Micro-Pavé Crystals • Anti-Tarnish",
    description: "Delicate gold chain bracelet station-set with sparkling six-petal crystal flower charms. Handcrafted with anti-tarnish coating for everyday elegance.",
    price: 290,
    originalPrice: 580,
    image: br1,
    images: [br1, br1_2],
    category: "Bracelets"
  },
  {
    id: "ginkgo-starburst-bracelet",
    name: "Ginkgo & Starburst Bracelet",
    material: "18k Gold Plated • Cutout Ginkgo & Zirconia Starburst",
    description: "An artistic gold bracelet pairing fan-shaped ginkgo leaf cutouts with radiant zirconia starburst charms. Waterproof and tarnish-free.",
    price: 290,
    originalPrice: 580,
    image: br2,
    images: [br2, br2_2],
    category: "Bracelets"
  },
  {
    id: "serpentine-heart-drop-bracelet",
    name: "Serpentine Heart Drop Bracelet",
    material: "18k Gold Finish • Heart-Cut Cubic Zirconia",
    description: "A playful wavy serpentine gold chain adorned with cascading heart-cut crystal drops that glimmer with every motion.",
    price: 280,
    originalPrice: 560,
    image: br3,
    images: [br3, br3_2],
    category: "Bracelets"
  },
  {
    id: "emerald-halo-wave-bracelet",
    name: "Emerald Halo Wave Bracelet",
    material: "18k Solid Gold Finish • Emerald Gems • Micro-Pavé Halo",
    description: "Vibrant square emerald gemstones encircled by shimmering micro-pavé halos along a textured wave chain. Pure statement luxury.",
    price: 299,
    originalPrice: 598,
    image: br4,
    images: [br4, br4_2],
    category: "Bracelets"
  },
  {
    id: "golden-butterfly-station-bracelet",
    name: "Golden Butterfly Station Bracelet",
    material: "18k Gold Plated • Bezel Crystal Accents • Waterproof",
    description: "Delicate gold link chain featuring miniature golden butterfly silhouettes alternating with solitaire bezel crystal stones.",
    price: 260,
    originalPrice: 520,
    image: br5,
    images: [br5, br5_2],
    category: "Bracelets"
  },
  {
    id: "aquamarine-solitaire-oval-bracelet",
    name: "Aquamarine Solitaire Oval Bracelet",
    material: "18k Gold Finish • Emerald-Cut Aquamarine • Satin Oval Beads",
    description: "Sleek open-link gold bracelet anchored by a soft aquamarine blue gemstone and flanked by satin-brushed gold oval beads.",
    price: 280,
    originalPrice: 560,
    image: br6,
    images: [br6, br6_2],
    category: "Bracelets"
  },
  {
    id: "celestial-sunburst-gemstone-bracelet",
    name: "Celestial Sunburst & Gemstone Charm Bracelet",
    material: "18k Gold Finish • Multi-Gemstone Cabochons • Sunburst Charms",
    description: "Bohemian luxury featuring gold sunburst motifs paired with vibrant turquoise, ruby red, and sapphire blue gemstone charms.",
    price: 270,
    originalPrice: 540,
    image: br7,
    images: [br7, br7_2],
    category: "Bracelets"
  },
  {
    id: "opal-drop-braided-bracelet",
    name: "Opal Drop Braided Bracelet",
    material: "18k Gold Plated • Luminous Opal Drops • Wheat Chain",
    description: "Hand-braided wheat chain bracelet with iridescent round opal gemstone dangles. Finished with a subtle gold heart clasp charm.",
    price: 270,
    originalPrice: 540,
    image: br8,
    images: [br8],
    category: "Bracelets"
  },
  {
    id: "puffy-heart-beaded-rope-bracelet",
    name: "Puffy Heart Beaded Rope Bracelet",
    material: "18k Gold Finish • Solid Puffy Heart • Beaded Rope Chain",
    description: "Charming gold twisted rope bracelet featuring station beads and a smooth high-polish puffy gold heart centerpiece.",
    price: 250,
    originalPrice: 500,
    image: br9,
    images: [br9, br9_2],
    category: "Bracelets"
  }
];
