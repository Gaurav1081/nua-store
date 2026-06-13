// Since FakeStore API doesn't have variant data, we generate
// deterministic variants based on product id so detail pages
// remain deep-linkable and consistent.

export const COLORS = [
  { name: 'Black', hex: '#1a1714' },
  { name: 'White', hex: '#f5f5f0' },
  { name: 'Navy', hex: '#1e2d5a' },
  { name: 'Terracotta', hex: '#c2490d' },
  { name: 'Sage', hex: '#7a9e7e' },
  { name: 'Camel', hex: '#c19a6b' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CLOTHING_CATEGORIES = ["men's clothing", "women's clothing"];

// Generate a seeded pseudo-random number
function seededRand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate deterministic variants for a product based on its id.
// Returns null for non-clothing categories (electronics, jewelery, etc.)
export function getProductVariants(productId, category) {
  if (!CLOTHING_CATEGORIES.includes(category)) return null;

  const id = Number(productId);

  // Pick 2-4 colors
  const numColors = 2 + (id % 3);
  const colorOffset = id % COLORS.length;
  const colors = COLORS.slice(colorOffset, colorOffset + numColors).concat(
    COLORS.slice(0, Math.max(0, colorOffset + numColors - COLORS.length))
  );

  // Pick 4-6 sizes
  const numSizes = 4 + (id % 3);
  const sizes = SIZES.slice(0, numSizes);

  // Assign stock states: available, low_stock (1-2 units), sold_out
  const sizeStates = sizes.map((size, i) => {
    const r = seededRand(id * 31 + i * 17);
    if (r < 0.15) return { size, status: 'sold_out', stock: 0 };
    if (r < 0.35) return { size, status: 'low_stock', stock: Math.ceil(r * 3) };
    return { size, status: 'available', stock: 10 };
  });

  return { colors, sizeStates };
}

// Generate a fake sale price for some products
export function getSaleInfo(productId, price) {
  const id = Number(productId);
  const hasSale = seededRand(id * 53) < 0.35;
  if (!hasSale) return { salePrice: null, originalPrice: price };
  const discount = 0.1 + seededRand(id * 71) * 0.3; // 10-40% off
  return {
    salePrice: parseFloat((price * (1 - discount)).toFixed(2)),
    originalPrice: price,
  };
}

// Generate fake brand names by category
export const BRANDS_BY_CATEGORY = {
  "men's clothing": ['Arcana', 'Fieldhaven', 'Korvald', 'Dunmore'],
  "women's clothing": ['Mireille', 'Aldea', 'Sorenna', 'Veltine'],
  electronics: ['Novex', 'Kairon', 'Zyphex', 'Lumatec'],
  jewelery: ['Elara', 'Thornwood', 'Caspian', 'Velour'],
};

export function getBrand(category, productId) {
  const brands = BRANDS_BY_CATEGORY[category] || ['Nua'];
  return brands[Number(productId) % brands.length];
}