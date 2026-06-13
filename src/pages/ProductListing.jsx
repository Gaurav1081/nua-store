import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard/ProductCard';
import styles from './ProductListing.module.scss';

const CATEGORIES = ['all', "men's clothing", "women's clothing", 'electronics', 'jewelery'];

export default function ProductListing() {
  const { data: products, loading, error, refetch } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating.rate - a.rating.rate);
    return list;
  }, [products, activeCategory, sortBy]);

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>New Arrivals</h1>
        <p className={styles.heroSub}>Curated pieces for the considered wardrobe</p>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat.replace("'s", "'s")}
              </button>
            ))}
          </div>
          <div className={styles.sortWrap}>
            <label htmlFor="sort" className={styles.sortLabel}>Sort</label>
            <select
              id="sort"
              className={styles.sort}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {loading && <SkeletonGrid />}

        {error && (
          <div className={styles.error}>
            <p>Failed to load products. {error}</p>
            <button className={styles.retryBtn} onClick={refetch}>Try Again</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className={styles.resultCount}>{filtered.length} products</p>
            <div className={styles.grid}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function SkeletonGrid() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.skeleton}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonBody}>
            <div className={styles.skeletonLine} style={{ width: '40%' }} />
            <div className={styles.skeletonLine} style={{ width: '85%' }} />
            <div className={styles.skeletonLine} style={{ width: '60%' }} />
            <div className={styles.skeletonLine} style={{ width: '30%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
