import { Link } from 'react-router-dom';
import { useCart } from '../../stores/CartContext';
import { useUI } from '../../stores/UIContext';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { totalItems } = useCart();
  const { openCart } = useUI();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>N</span>
          <span className={styles.logoText}>Nua</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Shop</Link>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.cartButton}
            onClick={openCart}
            aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
