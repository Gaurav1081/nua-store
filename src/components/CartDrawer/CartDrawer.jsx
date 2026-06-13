import { useEffect, useRef } from 'react';
import { useCart } from '../../stores/CartContext';
import { useUI } from '../../stores/UIContext';
import styles from './CartDrawer.module.scss';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const { cartOpen, closeCart } = useUI();
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const grandTotal = subtotal + shipping;

  // Focus trap and keyboard handling
  useEffect(() => {
    if (cartOpen) {
      closeBtnRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && cartOpen) closeCart();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [cartOpen, closeCart]);

  return (
    <>
      <div
        className={`${styles.overlay} ${cartOpen ? styles.overlayVisible : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`${styles.drawer} ${cartOpen ? styles.drawerOpen : ''}`}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Your Cart</h2>
          {items.length > 0 && (
            <span className={styles.itemCount}>{items.reduce((s, i) => s + i.quantity, 0)} items</span>
          )}
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ul className={styles.itemList}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} onRemove={removeItem} onQuantityChange={updateQuantity} />
              ))}
            </ul>

            <div className={styles.summary}>
              {subtotal <= 50 && (
                <div className={styles.shippingNote}>
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <button className={styles.checkoutBtn}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <li className={styles.item}>
      <img src={item.image} alt={item.name} className={styles.itemImage} />
      <div className={styles.itemDetails}>
        <p className={styles.itemName}>{item.name}</p>
        <p className={styles.itemVariant}>
          {item.color !== 'Default' && <span>{item.color}</span>}
          {item.size !== 'One Size' && <span>{item.size}</span>}
        </p>
        <div className={styles.itemFooter}>
          <div className={styles.qtyControl}>
            <button
              className={styles.qtyBtn}
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >−</button>
            <span className={styles.qty}>{item.quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= 10}
              aria-label="Increase quantity"
            >+</button>
          </div>
          <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button className={styles.removeBtn} onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
        <TrashIcon />
      </button>
    </li>
  );
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <p className={styles.emptyTitle}>Your cart is empty</p>
      <p className={styles.emptyText}>Add something you love to get started.</p>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}
