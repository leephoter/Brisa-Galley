'use client';

import { notFound, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';
import { getCollectionBySlug } from '@/lib/data';

export default function SeasonPage() {
  const params = useParams();
  const season = params.season as string;
  const collection = getCollectionBySlug(season);

  if (!collection || !season) {
    return notFound();
  }

  // Sample products for the collection
  const sampleProducts = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
    { id: 5, name: 'Product 5' },
    { id: 6, name: 'Product 6' },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroImagePlaceholder} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className={styles.season}>{collection.season}</p>
          <h1 className={styles.title}>{collection.title}</h1>
        </motion.div>
      </section>

      {/* Description Section */}
      <section className={styles.description}>
        <motion.div
          className={styles.descriptionContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p>{collection.description}</p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className={styles.products}>
        <div className={styles.grid}>
          {sampleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className={styles.productCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={styles.productImage}>
                <div className={styles.productImagePlaceholder}>
                  <span>{product.name}</span>
                </div>
              </div>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p>Sample Item</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Back Link */}
      <section className={styles.navigation}>
        <Link href='/collection' className={styles.backLink}>
          ← Back to Collections
        </Link>
      </section>
    </div>
  );
}
