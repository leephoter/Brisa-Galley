'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Link href={`/shop/${product.slug}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <div className={styles.imagePlaceholder}>
            {/* Placeholder - users can replace with actual images */}
            <span className={styles.imageText}>{product.name}</span>
          </div>
          {!product.inStock && (
            <div className={styles.outOfStock}>
              <span>OUT OF STOCK</span>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.price}>{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
