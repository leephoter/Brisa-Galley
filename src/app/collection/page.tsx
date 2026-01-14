'use client';

import { motion } from 'framer-motion';
import CollectionCard from '@/components/features/CollectionCard';
import { collections } from '@/lib/data';
import styles from './page.module.css';

export default function CollectionPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>COLLECTION</h1>
          <p>Explore our seasonal collections spanning from 2022 to present</p>
        </motion.div>
      </section>

      <section className={styles.collections}>
        <div className={styles.grid}>
          {collections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { season: 'a' } }, { params: { season: 'b' } }],
//     fallback: false,
//   };
// }
