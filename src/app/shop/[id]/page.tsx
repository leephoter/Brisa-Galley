'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/data';
import styles from './page.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const product = getProductBySlug(id);

  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Product Not Found</h1>
          <Link href="/shop" className={styles.backLink}>
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <div className={styles.imagePlaceholder}>
              <span>{product.name}</span>
              <p className={styles.imageNumber}>Image {selectedImage + 1}</p>
            </div>
          </div>

          <div className={styles.thumbnails}>
            {product.images.map((_, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${
                  selectedImage === index ? styles.active : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className={styles.thumbnailPlaceholder}>
                  <span>{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <motion.div
          className={styles.info}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.infoHeader}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>
          </div>

          <div className={styles.description}>
            <p>{product.description}</p>
          </div>

          <div className={styles.actions}>
            {product.inStock ? (
              <button className={styles.addToCart}>ADD TO CART</button>
            ) : (
              <button className={styles.outOfStock} disabled>
                OUT OF STOCK
              </button>
            )}
          </div>

          <div className={styles.details}>
            <details className={styles.detailsItem}>
              <summary>Product Details</summary>
              <div className={styles.detailsContent}>
                <ul>
                  <li>High-quality materials</li>
                  <li>Expert craftsmanship</li>
                  <li>Timeless design</li>
                  <li>Made with care</li>
                </ul>
              </div>
            </details>

            <details className={styles.detailsItem}>
              <summary>Size & Fit</summary>
              <div className={styles.detailsContent}>
                <p>Model is 180cm and wears size M</p>
                <p>Regular fit</p>
              </div>
            </details>

            <details className={styles.detailsItem}>
              <summary>Shipping & Returns</summary>
              <div className={styles.detailsContent}>
                <p>Free shipping on orders over ₩50,000</p>
                <p>30-day return policy</p>
              </div>
            </details>
          </div>

          <Link href="/shop" className={styles.backLink}>
            ← Back to Shop
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
