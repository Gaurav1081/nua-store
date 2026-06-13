import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../stores/CartContext';
import { useUI } from '../stores/UIContext';
import { getProductVariants, getSaleInfo, getBrand } from '../data/variants';
import styles from './ProductDetail.module.scss';

// Simulate async add-to-cart with random failure (bonus requirement)
async function mockAddToCartAPI() {
  await new Promise((res) => setTimeout(res, 600 + Math.random() * 400));
  if (Math.random() < 0.15) throw new Error('Network error. Please try again.');
}

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error } = useProduct(id);
  const { addItem } = useCart();
  const { openCart } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Only compute variants once product is fully loaded (category must exist)
  const variants = product ? getProductVariants(product.id, product.category) : null;
  const { salePrice, originalPrice } = product ? getSaleInfo(product.id, product.price) : {};
  const brand = product ? getBrand(product.category, product.id) : '';

  const hasVariants = variants !== null;

  // URL-synced variant state — only meaningful for clothing
  const selectedColor = searchParams.get('color') || (variants?.colors[0]?.name ?? '');
  const selectedSize = searchParams.get('size') || '';

  const setSelectedColor = (color) => {
    setSearchParams((prev) => { prev.set('color', color); prev.delete('size'); return prev; }, { replace: true });
  };
  const setSelectedSize = (size) => {
    setSearchParams((prev) => { prev.set('size', size); return prev; }, { replace: true });
  };

  // Reset on product change
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setAddError('');
    setAddSuccess(false);
  }, [id]);

  // Auto-select first color once variants are available
  useEffect(() => {
    if (variants && !searchParams.get('color')) {
      setSearchParams((prev) => { prev.set('color', variants.colors[0].name); return prev; }, { replace: true });
    }
  }, [variants]);

  const selectedSizeData = variants?.sizeStates.find((s) => s.size === selectedSize);
  const isSoldOut = selectedSizeData?.status === 'sold_out';
  const isLowStock = selectedSizeData?.status === 'low_stock';

  // Clothing: requires a size selection. Non-clothing: always addable.
  const canAdd = hasVariants
    ? !!selectedSize && !isSoldOut && !adding
    : !adding;

  const displayPrice = salePrice ?? originalPrice;

  // Fake image thumbnails using the same image (FakeStore only has one per product)
  const thumbnails = product
    ? [product.image, product.image, product.image, product.image].slice(0, 4)
    : [];

  const handleAddToCart = async () => {
    if (!canAdd) return;
    setAdding(true);
    setAddError('');
    try {
      await mockAddToCartAPI();
      addItem({
        productId: product.id,
        name: product.title,
        image: product.image,
        price: displayPrice,
        ...(hasVariants && { color: selectedColor, size: selectedSize }),
        quantity,
      });
      setAddSuccess(true);
      openCart();
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>Could not load this product.</p>
        <button onClick={() => navigate('/')} className={styles.backBtn}>← Back to shop</button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link to="/">Shop</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.category}</span>
        </nav>

        <div className={styles.layout}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              <img
                src={thumbnails[selectedImage]}
                alt={product.title}
                className={styles.mainImage}
              />
              {salePrice && <span className={styles.saleBadge}>Sale</span>}
            </div>
            <div className={styles.thumbnails}>
              {thumbnails.map((src, i) => (
                <button
                  key={i}
                  className={`${styles.thumbBtn} ${selectedImage === i ? styles.thumbBtnActive : ''}`}
                  onClick={() => setSelectedImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoTop}>
              <div className={styles.brandRow}>
                <span className={styles.brand}>{brand}</span>
                <span className={styles.categoryTag}>{product.category}</span>
              </div>
              <h1 className={styles.title}>{product.title}</h1>

              <div className={styles.ratingRow}>
                <StarRating rating={product.rating?.rate} />
                <span className={styles.ratingText}>{product.rating?.rate} ({product.rating?.count} reviews)</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>${displayPrice?.toFixed(2)}</span>
                {salePrice && (
                  <>
                    <span className={styles.originalPrice}>${originalPrice?.toFixed(2)}</span>
                    <span className={styles.discount}>
                      {Math.round((1 - salePrice / originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={styles.divider} />

            {/* Colour — clothing only */}
            {hasVariants && variants.colors.length > 0 && (
              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>
                  Colour: <strong>{selectedColor}</strong>
                </div>
                <div className={styles.swatches}>
                  {variants.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`${styles.swatch} ${selectedColor === color.name ? styles.swatchActive : ''}`}
                      style={{ '--swatch-color': color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      aria-label={color.name}
                      aria-pressed={selectedColor === color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size — clothing only */}
            {hasVariants && variants.sizeStates.length > 0 && (
              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>
                  Size: {selectedSize
                    ? <strong>{selectedSize}</strong>
                    : <span className={styles.optionHint}>Select a size</span>}
                </div>
                <div className={styles.sizes}>
                  {variants.sizeStates.map(({ size, status }) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ''} ${styles[`sizeBtn_${status}`]}`}
                      onClick={() => status !== 'sold_out' && setSelectedSize(size)}
                      disabled={status === 'sold_out'}
                      aria-label={`Size ${size}${status === 'sold_out' ? ', sold out' : status === 'low_stock' ? ', low stock' : ''}`}
                    >
                      {size}
                      {status === 'sold_out' && <span className={styles.soldOutLine} />}
                    </button>
                  ))}
                </div>
                {isLowStock && (
                  <p className={styles.lowStockMsg}>⚡ Only {selectedSizeData.stock} left in stock</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className={styles.optionGroup}>
              <div className={styles.optionLabel}>Quantity</div>
              <div className={styles.qtyRow}>
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10 || (isLowStock && quantity >= selectedSizeData.stock)}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className={styles.ctaWrap}>
              {addError && <p className={styles.addError}>{addError}</p>}
              {addSuccess && <p className={styles.addSuccess}>✓ Added to cart!</p>}
              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={!canAdd}
                aria-disabled={!canAdd}
              >
                {adding ? (
                  <><span className={styles.spinner} /> Adding…</>
                ) : isSoldOut ? (
                  'Sold Out'
                ) : hasVariants && !selectedSize ? (
                  'Select a Size'
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>

            <div className={styles.divider} />

            {/* Description */}
            <div className={styles.description}>
              <h2 className={styles.descTitle}>About this product</h2>
              <p className={styles.descText}>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StarRating({ rating = 0 }) {
  return (
    <div className={styles.stars} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`${styles.star} ${s <= Math.round(rating) ? styles.starFilled : ''}`}>★</span>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.gallery}>
            <div className={`${styles.mainImageWrap} ${styles.skeletonBox}`} style={{ aspectRatio: '1', borderRadius: '12px' }} />
            <div className={styles.thumbnails}>
              {[0,1,2,3].map(i => <div key={i} className={`${styles.thumbBtn} ${styles.skeletonBox}`} />)}
            </div>
          </div>
          <div className={styles.info}>
            {[80, 60, 100, 40, 70, 50].map((w, i) => (
              <div key={i} className={styles.skeletonBox} style={{ height: i === 2 ? 32 : 16, width: `${w}%`, marginBottom: 12, borderRadius: 4 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}