import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../stores/CartContext';
import { useUI } from '../../stores/UIContext';
import { getSaleInfo, getBrand } from '../../data/variants';
import styles from './ProductCard.module.scss';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { openCart } = useUI();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { salePrice, originalPrice } = getSaleInfo(product.id, product.price);
  const brand = getBrand(product.category, product.id);
  const displayPrice = salePrice ?? originalPrice;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    // Simulate async add (bonus requirement)
    await new Promise((res) => setTimeout(res, 400));
    addItem({
      productId: product.id,
      name: product.title,
      image: product.image,
      price: displayPrice,
      color: 'Default',
      size: 'One Size',
      quantity: 1,
    });
    setAdding(false);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageLink} aria-label={product.title}>
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        </div>
        {salePrice && <span className={styles.saleBadge}>Sale</span>}
      </Link>

      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.brand}>{brand}</span>
          <span className={styles.category}>{product.category}</span>
        </div>

        <Link to={`/product/${product.id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{product.title}</h2>
        </Link>

        <div className={styles.priceRow}>
          <span className={styles.price}>${displayPrice.toFixed(2)}</span>
          {salePrice && (
            <span className={styles.originalPrice}>${originalPrice.toFixed(2)}</span>
          )}
        </div>

        <div className={styles.ratingRow}>
          <StarRating rating={product.rating?.rate} />
          <span className={styles.ratingCount}>({product.rating?.count})</span>
        </div>

        <button
          className={styles.addButton}
          onClick={handleQuickAdd}
          disabled={adding}
          aria-label={`Quick add ${product.title} to cart`}
        >
          {adding ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : added ? (
            <>
              <CheckIcon />
              Added
            </>
          ) : (
            'Quick Add'
          )}
        </button>
      </div>
    </article>
  );
}

function StarRating({ rating = 0 }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= Math.round(rating) ? styles.starFilled : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
