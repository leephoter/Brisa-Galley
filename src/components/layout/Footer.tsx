import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About */}
          <div className={styles.column}>
            <h3 className={styles.title}>Brisa Gallery</h3>
            <p className={styles.description}>
              Crafting timeless pieces for the modern wardrobe since 2022.
            </p>
          </div>

          {/* Shop */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Shop</h4>
            <ul className={styles.links}>
              <li>
                <Link href='/shop'>All Products</Link>
              </li>
              <li>
                <Link href='/collection'>Collections</Link>
              </li>
              <li>
                <Link href='/collection/2025-aw'>Latest Collection</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Company</h4>
            <ul className={styles.links}>
              <li>
                <Link href='/about'>About</Link>
              </li>
              <li>
                <Link href='/stockists'>Stockists</Link>
              </li>
              <li>
                <Link href='/contact'>Contact</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Support</h4>
            <ul className={styles.links}>
              <li>
                <a href='mailto:info@Brisagallery.com'>Customer Service</a>
              </li>
              <li>
                <a href='#'>Shipping & Returns</a>
              </li>
              <li>
                <a href='#'>Size Guide</a>
              </li>
              <li>
                <a href='#'>FAQ</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Brisa Gallery. All rights reserved.
          </p>
          <div className={styles.social}>
            <a href='#' className={styles.socialLink}>
              Instagram
            </a>
            <a href='#' className={styles.socialLink}>
              Facebook
            </a>
            <a href='#' className={styles.socialLink}>
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
