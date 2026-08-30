export interface Product {
  id: string;
  name: string;
  material: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
}

export const CATEGORIES = ["All", "Necklaces", "Earrings", "Rings"] as const;
export type Category = typeof CATEGORIES[number];

export const products: Product[] = [
  {
    id: "solstice-pendant",
    name: "Solstice Pendant",
    material: "18k Gold Plated • Anti-Tarnish",
    description: "A quiet celebration of light. The Solstice Pendant features a brilliant pear-cut diamond suspended delicately on a whisper-thin gold chain. Water-resistant and anti-tarnish designed for daily wear.",
    price: 1250,
    originalPrice: 2500,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ1VgJ7XHBzBTfJrYQ9ogKzRlbinaRA_MjKJxS6jioh_5j9XKrq_9VNNIzc634L611kloAlGXi4gB9Nb-rY_JQJDA9atoAPbS0aQj_HbZfnCNswp-5kkoTmucOZAFGt4xZ8ga3ZzqfvUHtNyy7ClI6i_LRzvG43OM8R1ILmjs_1KMCT2mtcV-qEW4O_WacPR375syR_bODAZhbX-kGBKYxRMxArCLiHFZN9NUZjRoWD7OvGjBJIO7VkQ",
    category: "Necklaces"
  },
  {
    id: "aura-sculpted-hoops",
    name: "Aura Sculpted Hoops",
    material: "14k Gold Finish • Waterproof",
    description: "Sculptural gold hoop earrings crafted with an organic curve and brilliant mirror polish. Lightweight, anti-tarnish and comfortable all day.",
    price: 990,
    originalPrice: 1980,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLJ3BcuxjBjuS6BRf0LJeGELPhpfHpN5Rdw7RX_FjsK1iHaKZXPrCWkKguSxj8hZ8RRxBK12RLmzHzDsV6VY6Z0t_3kwC5cGoWFNBKOGwDLRfH8xnNW1qlalxqcM3O7EyiSZsrZePvBCLaYqIc2eYBHS5XOUZVoys754T1l53G3X1MF4SFuw817TTsdkrL7BiWwJtVLJNipyQWGTgx9o19-cd1wgHMPZa7uKZ2SrNpreNRoJorKi2fSg",
    category: "Earrings"
  },
  {
    id: "lumina-pearl-drop",
    name: "Lumina Pearl Drop",
    material: "18k Solid Gold Finish • Freshwater Pearl",
    description: "A delicate gold chain necklace with a luminous round pearl pendant. Drapes organically for timeless sophistication and subtle everyday shine.",
    price: 1450,
    originalPrice: 2900,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-zxUecpxd0Rf6yATZou2oVSp0Sc61aWXT1FJaddjlTLtJgChjbi8H2eGIGU4RBbOh0p8v-jBMsGedyXXlsOs8-3LPG6eOxw2OC8GIyxUj0rDsXnFlq1IubwvaeFTZmkkj-SV6F14cVuwUrBc16iG4-fC66HNW_tgJ_umJjXHjxN9WElYsn9Vt8tDX3HG39woglp1iDAn9PlzULBGUaBs0d5ykO90QEmqYZowAxflGqmdEkHeVN_J9Kg",
    category: "Necklaces"
  },
  {
    id: "aura-signet-ring",
    name: "Aura Signet Ring",
    material: "Hand-hammered Gold • Anti-Tarnish",
    description: "Chunky, textured gold signet ring featuring a hammered surface finish. Bold yet minimal, built with premium anti-tarnish coating.",
    price: 1190,
    originalPrice: 2380,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbNgeWDT_Tk9EyUTyi5OeGtPCcqcBb186pJZXt5GxXTES1QqrztcbDz2PAentLJRiUJcUbeTm8qJy1oq27wcCAwbNVnqJkPA_7e-azpsWzmXgkvCpZXtIdhZS7DUS-ao6drYk-qqAkno5xrsuCC0eE233EI14oe_3pEbO0ZN4zxH24pdKo8ythffIg-kd_F0RNilfsGsx4kQKnDX40VS6qZwqJFUBCugxpHFv-unxDDPNwqyuT1XD1Ag",
    category: "Rings"
  },
  {
    id: "cascade-diamond-studs",
    name: "Cascade Diamond Studs",
    material: "Zirconia Crystals, 18k Gold",
    description: "Cascading diamond-inspired studs that catch light from every angle. Soft silk champagne elegance designed for special occasions and daily luxury.",
    price: 1690,
    originalPrice: 3380,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4yQ3HHMiyRFH2FjaWeREbQ3Gha0AXYffp8VV0lqjMy0-qraudlsvrb8Izd6KM-JxX5lohwW9Ufhn4n-fVjVsnOvS834vb_M3SpbgJu2KeK8uJCE9RyTMJ-RRmFHY7TEn1DCxMR9oeC1CmWIdQq4I4OUFKsAbPLiZN2ynSoO0IszrVbYj4bZEPnmvTgZetiUo0nIwqqybBRkdO3baSiO8kNV1OhLy_e98l3d3m7u4XwGPd2yJbymomlw",
    category: "Earrings"
  },
  {
    id: "eclipse-collar",
    name: "Eclipse Collar",
    material: "Architectural Structure • Waterproof",
    description: "A rigid gold collar necklace with a sleek curved silhouette. Modern art-gallery aesthetic crafted with durable anti-tarnish coating.",
    price: 1850,
    originalPrice: 3700,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaoTOkWAZ0d1q29Bdb8r07hNGuvKgmH14bRuQEsCtRTXoB1zebjb-cWo1WzT7WtA9vvhfngGHnKyon8r5rRkrqX4dhHlDDzRUSxtB5Onb4jUOnDWVay1gOnD_GvtDwmDBZKjJsoaXHXUg7rUOj9Q_2GAp_Xx0YCMp9u5YsZFFu5UZWV3wIQJsl3YgZpIHLLKG65lVrjz0G-QycYXAROuGnD4dkugOkZ1WXjn4u6JFmaPF-kCd0Dm6MWA",
    category: "Necklaces"
  },
  // Duplicated / Expanded collection items for rich selection & testing
  {
    id: "celestial-chain-necklace",
    name: "Celestial Layered Chain",
    material: "18k Gold Plated • Anti-Tarnish",
    description: "An intricate double-layer gold chain featuring subtle starburst charms. Hypoallergenic and resistant to tarnish for continuous daily wear.",
    price: 1390,
    originalPrice: 2780,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ1VgJ7XHBzBTfJrYQ9ogKzRlbinaRA_MjKJxS6jioh_5j9XKrq_9VNNIzc634L611kloAlGXi4gB9Nb-rY_JQJDA9atoAPbS0aQj_HbZfnCNswp-5kkoTmucOZAFGt4xZ8ga3ZzqfvUHtNyy7ClI6i_LRzvG43OM8R1ILmjs_1KMCT2mtcV-qEW4O_WacPR375syR_bODAZhbX-kGBKYxRMxArCLiHFZN9NUZjRoWD7OvGjBJIO7VkQ",
    category: "Necklaces"
  },
  {
    id: "serene-twisted-hoops",
    name: "Serene Twisted Hoops",
    material: "18k Solid Gold Finish • Waterproof",
    description: "Elegantly twisted rope hoop earrings with high polish. Designed for sweatproof, waterproof durability that stays radiant.",
    price: 1090,
    originalPrice: 2180,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLJ3BcuxjBjuS6BRf0LJeGELPhpfHpN5Rdw7RX_FjsK1iHaKZXPrCWkKguSxj8hZ8RRxBK12RLmzHzDsV6VY6Z0t_3kwC5cGoWFNBKOGwDLRfH8xnNW1qlalxqcM3O7EyiSZsrZePvBCLaYqIc2eYBHS5XOUZVoys754T1l53G3X1MF4SFuw817TTsdkrL7BiWwJtVLJNipyQWGTgx9o19-cd1wgHMPZa7uKZ2SrNpreNRoJorKi2fSg",
    category: "Earrings"
  },
  {
    id: "solaris-stacked-ring",
    name: "Solaris Stacked Ring Set",
    material: "14k Gold Plated • Anti-Tarnish",
    description: "Set of three minimal gold band rings that can be worn individually or stacked. Textured finish crafted for effortless mixing.",
    price: 1150,
    originalPrice: 2300,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbNgeWDT_Tk9EyUTyi5OeGtPCcqcBb186pJZXt5GxXTES1QqrztcbDz2PAentLJRiUJcUbeTm8qJy1oq27wcCAwbNVnqJkPA_7e-azpsWzmXgkvCpZXtIdhZS7DUS-ao6drYk-qqAkno5xrsuCC0eE233EI14oe_3pEbO0ZN4zxH24pdKo8ythffIg-kd_F0RNilfsGsx4kQKnDX40VS6qZwqJFUBCugxpHFv-unxDDPNwqyuT1XD1Ag",
    category: "Rings"
  },
  {
    id: "baroque-pearl-choker",
    name: "Baroque Pearl Choker",
    material: "Natural Freshwater Pearl & 18k Gold",
    description: "Unique organic freshwater pearls paired with a delicate gold toggle clasp. Statement accessory blending classic beauty with modern edge.",
    price: 1550,
    originalPrice: 3100,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-zxUecpxd0Rf6yATZou2oVSp0Sc61aWXT1FJaddjlTLtJgChjbi8H2eGIGU4RBbOh0p8v-jBMsGedyXXlsOs8-3LPG6eOxw2OC8GIyxUj0rDsXnFlq1IubwvaeFTZmkkj-SV6F14cVuwUrBc16iG4-fC66HNW_tgJ_umJjXHjxN9WElYsn9Vt8tDX3HG39woglp1iDAn9PlzULBGUaBs0d5ykO90QEmqYZowAxflGqmdEkHeVN_J9Kg",
    category: "Necklaces"
  },
  {
    id: "radiant-drop-earrings",
    name: "Radiant Crystal Drops",
    material: "18k Gold Finish • Anti-Tarnish",
    description: "Delicate tear-drop crystal earrings that sway gracefully. Lightweight design featuring 100% anti-tarnish protective sealing.",
    price: 1290,
    originalPrice: 2580,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4yQ3HHMiyRFH2FjaWeREbQ3Gha0AXYffp8VV0lqjMy0-qraudlsvrb8Izd6KM-JxX5lohwW9Ufhn4n-fVjVsnOvS834vb_M3SpbgJu2KeK8uJCE9RyTMJ-RRmFHY7TEn1DCxMR9oeC1CmWIdQq4I4OUFKsAbPLiZN2ynSoO0IszrVbYj4bZEPnmvTgZetiUo0nIwqqybBRkdO3baSiO8kNV1OhLy_e98l3d3m7u4XwGPd2yJbymomlw",
    category: "Earrings"
  },
  {
    id: "minimalist-pave-ring",
    name: "Minimalist Pavé Band",
    material: "18k Gold & Cubic Zirconia",
    description: "Slender gold ring encrusted with micro-pavé cubic zirconia stones. Shimmering contrast for stacking or delicate solitary accent.",
    price: 950,
    originalPrice: 1900,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbNgeWDT_Tk9EyUTyi5OeGtPCcqcBb186pJZXt5GxXTES1QqrztcbDz2PAentLJRiUJcUbeTm8qJy1oq27wcCAwbNVnqJkPA_7e-azpsWzmXgkvCpZXtIdhZS7DUS-ao6drYk-qqAkno5xrsuCC0eE233EI14oe_3pEbO0ZN4zxH24pdKo8ythffIg-kd_F0RNilfsGsx4kQKnDX40VS6qZwqJFUBCugxpHFv-unxDDPNwqyuT1XD1Ag",
    category: "Rings"
  }
];
